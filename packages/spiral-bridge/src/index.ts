import { WriteAwaySeo, RedaxtorSeoData } from '@writeaway/plugin-seo';
import { WriteAwayBackground, WriteAwayImageTag, WriteAwayMedium } from '@writeaway/plugin-medium';
import { WriteAwayCodeMirror } from '@writeaway/plugin-codemirror';
import { WriteAwayCore } from '@writeaway/core';

/*
  require('./submodules/redaxtor/src/styles/redaxtor.less');
  require('./medium-editor.less');
  require('./submodules/redaxtor-medium/src/redaxtor-medium.less');
  require('./submodules/redaxtor-seo/src/google-preview.less');

  require('./node_modules/codemirror/lib/codemirror.css');
  require('./spiral-specific.css');
 */

const components = {
  html: WriteAwayMedium,
  image: WriteAwayImageTag,
  background: WriteAwayBackground,
  source: WriteAwayCodeMirror,
  seo: WriteAwaySeo,
};

/**
 * Redaxtor bundle specific for SpiralScout
 */
class WriteAwaySpiralBundle extends WriteAwayCore {
  /**
   * Attaches invisible div handling SEO editing
   * @param {Object} data
   */
  attachSeo(data: RedaxtorSeoData) {
    setTimeout(() => {
      const div = document.createElement('div');

      if (window.metadata && window.metadata['meta-save-url']) {
        div.setAttribute('data-save-url', window.metadata['meta-save-url']);
        delete window.metadata['meta-save-url'];
      }

      if (data && data['meta-save-url']) {
        div.setAttribute('data-save-url', data['meta-save-url']);
        delete data['meta-save-url'];
      }

      div.innerHTML = 'Edit SEO Meta';
      div.className = 'edit-seo-div';
      div.style.display = 'none';
      this.addPiece(div, {
        id: 'seo',
        name: 'Edit SEO',
        type: 'seo',
        data: {
          html: (data && data.html)
            || '',
          title: (data && data.title)
            || (document.querySelector('title') && document.querySelector('title').innerHTML)
            || '',
          description: (data && data.description)
            || (document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute('content'))
            || '',
          keywords: (data && data.keywords)
            || (document.querySelector('meta[name="keywords"]') && document.querySelector('meta[name="keywords"]').getAttribute('content'))
            || '',
        },
      });
      document.querySelector('body').appendChild(div);
    });
  }

  /**
   * Constructor
   * @param {RedaxtorOptions} options
   */
  constructor(options) {
    options.pieces.components = components;
    options.pieceNameGroupSeparator = ':';
    RedaxtorBundle.checkHtmlPiecesCompartibility(document);
    super(options);

    if (options.editorActive == undefined || options.editorActive == null) {
      this.setEditorActive(RedaxtorBundle.getCookie('r_editorActive') == 'true');
    }
    if (options.navBarCollapsed == undefined || options.navBarCollapsed == null) {
      this.setNavBarCollapsed(RedaxtorBundle.getCookie('r_navBarCollapsed') == 'true');
    }
    if (options.expert == undefined || options.expert == null) {
      this.setExpertMode(RedaxtorBundle.getCookie('r_expert') == 'true');
    }

    this.onUnload = this.beforeUnload.bind(this);
    window.addEventListener('beforeunload', this.onUnload);
  }

  /**
   * beforeUnload listner
   * @param {*} event
   */
  beforeUnload(event) {
    RedaxtorBundle.setCookie('r_editorActive', this.isEditorActive());
    RedaxtorBundle.setCookie('r_navBarCollapsed', this.isNavBarCollapsed());
    RedaxtorBundle.setCookie('r_expert', this.isExpertMode());
  }

  /**
   * Set cookies
   * @param {string} name
   * @param {*} value
   */
  static setCookie(name, value) {
    const options = {};

    value = encodeURIComponent(value);

    let updatedCookie = `${name}=${value}`;

    for (const propName in options) {
      if (options.hasOwnProperty(propName)) {
        updatedCookie += `; ${propName}`;
        const propValue = options[propName];
        if (propValue !== true) {
          updatedCookie += `=${propValue}`;
        }
      }
    }

    document.cookie = updatedCookie;
  }

  /**
   * Gets a document cookies
   * @param {string} name
   * @return {*}
   */
  static getCookie(name) {
    const matches = document.cookie.match(new RegExp(
      `(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`,
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  /**
   * Scans html pieces for invalid internal html and reverts them to source editor if needed
   * @param {HTMLElement} node
   */
  static checkHtmlPiecesCompartibility(node) {
    /**
     * In Spiral html pieces are marked up as data-piece="html", collect them
     */
    const pieces = node.querySelectorAll('[data-piece="html"]');
    for (let i = 0; i < pieces.length; i++) {
      const piece = pieces[i];
      if (piece.querySelector('iframe')) {
        // We have invalid piece data, fallback to source
        piece.setAttribute('data-piece', 'source');
      }
      if (piece.querySelector('script')) {
        // Script is not expected to be editable at the moment
        piece.setAttribute('data-piece', 'source');
        piece.setAttribute('data-nonupdateable', '1');
      }
    }
  }
}

RedaxtorBundle.defaultApi = RedaxtorDefaultApi;

/**
 * Starts Redaxor in window scope, starts default SpiralScout API on urls provided and attaches a seo module with custom header html
 * @param {Object} urls
 * @param {string} urls.getPieceUrl url to get piece data for dynamic pieces.
 * This may be overrided for specific piece by setting `get-url` in piece user dataset.
 * I.e. in DOM node `data-get-url` attribute or manually in appPiece method)
 * @param {string} urls.savePieceUrl url to save piece data.
 * This may be overrided for specific piece by setting `save-url` in piece user dataset.
 * I.e. in DOM node `data-save-url` attribute or manually in appPiece method
 * @param {string} urls.saveMetaUrl url to save SEO piece data
 * @param {string} urls.imageGalleryUrl url to get image list
 * @param {string} urls.uploadUrl url upload images
 * @param {string} seoHtml
 * @param {*} options - init options to override for WA
 * @return {Redaxtor}
 */
RedaxtorBundle.startForSpiral = function (urls, seoHtml, options) {
  if (window.writeaway) {
    throw new Error('Seems Redaxtor is already started');
  }

  const fetchApi = require('./fetch-api');

  const spiralApi = {
    getNodeRect: RedaxtorDefaultApi.getNodeRect,
    /**
     * Fetch RX details
     * @param {RedaxtorPiece} piece
     * @return {Promise<RedaxtorPiece>}
     */
    getPieceData(piece) {
      if (!piece.dataset.nonupdateable) {
        return RedaxtorDefaultApi.getPieceData(piece);
      }
      return new Promise((resolve, reject) => {
        const data = piece.dataset;
        data.data = piece.data;
        fetchApi.post(piece.dataset.getUrl || urls.getPieceUrl, data).then(
          (resp) => {
            resp.piece.data.updateNode = false; // Force non updates of node
            piece.data = resp.piece.data;
            resolve(piece);
          }, (error) => {
            reject(error);
          },
        );
      });
    },
    /**
     * Save RX details
     * @param {RedaxtorPiece} piece
     * @return {Promise<RedaxtorPiece>}
     */
    savePieceData(piece) {
      return new Promise((resolve, reject) => {
        const data = piece.dataset;
        data.data = piece.data;

        if (piece.type == 'seo') {
          const metadata = piece.data;

          if (window.metadata) {
            // TODO: wtf is that?
            metadata.namespace = window.metadata.namespace;
            metadata.view = window.metadata.view;
            metadata.code = window.metadata.code;
          }

          fetchApi.post(piece.dataset.saveUrl || urls.saveMetaUrl, metadata).then((d) => {
            resolve();
          }, (error) => {
            reject(error);
          });
        } else {
          fetchApi.post(piece.dataset.saveUrl || urls.savePieceUrl, data).then((d) => {
            resolve();
          }, (error) => {
            reject(error);
          });
        }
      });
    },

    /**
     * Get image list
     * @return {Promise}
     */
    getImageList() {
      return new Promise((resolve, reject) => {
        fetchApi.get(urls.imageGalleryUrl).then((data) => {
          resolve((data.list || data).map((image) => {
            let thumb = image.thumbnailUrl || image.thumbnail_uri;
            if (thumb == '') {
              thumb = image.url || image.uri;
            }

            return {
              id: image.id || image.url || image.uri,
              url: image.url || image.uri,
              thumbnailUrl: thumb,
              width: image.width,
              height: image.height,
            };
          }));
        }, (error) => {
          reject(error);
        });
      });
    },

    /**
     * Upload image
     * @param {FormData} formData
     * @return {Promise<IRedaxtorResource>}
     */
    uploadImage(formData) {
      return new Promise((resolve, reject) => {
        // formData is FormData with image field. Add rest to formData if needed and submit.
        fetchApi.postFile(urls.uploadUrl, formData).then((data) => {
          var data = data.image || data.data || data;
          let thumb = data.thumbnailUrl || data.thumbnail_uri;
          if (thumb == '') {
            thumb = data.url || data.uri;
          }
          resolve({
            id: data.id || data.url || data.uri,
            url: data.url || data.uri,
            thumbnailUrl: thumb,
            width: data.width,
            height: data.height,
          });
        }, (error) => {
          reject(error);
        });
      });
    },

    /**
     * Delete image
     * @param {string} id id or url of image
     * @return {Promise<IRedaxtorResource>}
     */
    deleteImage: urls.deleteImageUrl ? function (id) {
      return new Promise((resolve, reject) => {
        // formData is FormData with image field. Add rest to formData if needed and submit.
        fetchApi.post(urls.deleteImageUrl, { id }).then((data) => {
          resolve({
            id: data.id || data.url || data.uri,
          });
        }, (error) => {
          reject(error);
        });
      });
    } : (void 0),
  };

  const writeaway = new RedaxtorBundle({
    pieces: {},
    options: options || {},
    api: spiralApi,
  });

  writeaway.attachSeo({
    html: seoHtml || (window.metadata && window.metadata.html),
  });

  window.writeaway = writeaway;

  return writeaway;
};

if (!window.WriteAwayBridge) {
  window.WriteAwayBridge = RedaxtorBundle;
}

module.exports = RedaxtorBundle;
