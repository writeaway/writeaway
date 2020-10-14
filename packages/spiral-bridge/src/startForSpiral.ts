import {
  defaultOptions, defaultPieces, defaultMinimumApi as BasicApi, GalleryItem, IPieceItem, IPiecesAPI,
} from '@writeaway/core';
import { components } from 'components';
import WriteAwaySpiralBundle from 'index';
import { globMeta, VAR_WA } from 'persist';
import {
  IMetadataSaveRequest, IPieceGetRequest, IPieceSaveRequest, Urls,
} from 'types';
import * as fetchApi from 'fetch-api';

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
 */
export const startForSpiral = (urls: Urls, seoHtml: string, options?: { [pieceType: string]: any }) => {
  if ((window as any)[VAR_WA]) {
    throw new Error('Seems Redaxtor is already started');
  }

  const spiralApi: IPiecesAPI = {
    ...BasicApi,
    /**
     * Fetch RX details
     */
    getPieceData: async (piece: IPieceItem) => {
      if (piece.dataset && !piece.dataset.nonupdateable) {
        return BasicApi.getPieceData(piece, BasicApi.resolvers);
      }

      const request: IPieceGetRequest = {
        id: piece.id,
        ...piece.dataset,
        data: piece.data,
      };
      const url = piece.dataset?.getUrl || urls.getPieceUrl;
      const resp = await fetchApi.post(url, request);
      return ({
        ...piece,
        data: {
          ...resp.piece.data,
          updateNode: false, // Force non updates of node, TODO: That should not be by flag like this
        },
      });
    },
    /**
     * Save RX details
     * @param {IPieceItem} piece
     * @return {Promise<IPieceItem>}
     */
    savePieceData: async (piece) => {
      if (piece.type === 'seo') {
        const metadata: IMetadataSaveRequest = {
          ...piece.data,
          namespace: globMeta()?.namespace,
          view: globMeta()?.view,
          code: globMeta()?.code,
        };

        return fetchApi.post(piece.dataset?.saveUrl || urls.saveMetaUrl, metadata);
      }
      const data: IPieceSaveRequest = { id: piece.id, ...piece.dataset, data: piece.data };
      return fetchApi.post(piece.dataset?.saveUrl || urls.savePieceUrl, data);
    },

    /**
     * Get image list
     * @return {Promise}
     */
    getImageList() {
      return new Promise((resolve, reject) => {
        fetchApi.get(urls.imageGalleryUrl, {}).then((data) => {
          resolve((data.list || data).map(
            (image: GalleryItem & {
              url?: string,
              uri?: string,
              thumbnailUrl?: string,
              thumbnail_uri?: string
            }) => ({
              id: image.id || image.url || image.uri,
              src: image.src || image.url || image.uri,
              thumbnailUrl: image.thumbnailUrl || image.thumbnail_uri || image.thumbnailSrc || image.src || image.url || image.uri,
              width: image.width,
              height: image.height,
            } as GalleryItem),
          ));
        }, (error) => {
          reject(error);
        });
      });
    },

    /**
     * Upload image
     * @param {File|FileList} file
     * @return {Promise<GalleryItem | GalleryItem[]>}
     */
    uploadImage: async (file) => {
      const formData = new FormData();
      if ((file as File).name) {
        formData.append('image', file as File);
      } else {
        for (let i = 0; i < (file as FileList).length; i += 1) {
          const f = (file as FileList).item(i);
          if (f) {
            formData.append(`images[${i}]`, f);
          }
        }
      }

      // formData is FormData with image field. Add rest to formData if needed and submit.
      const resp = await fetchApi.postFile(urls.uploadUrl, formData);

      const data = resp.image || resp.data || resp;
      const thumb = data.thumbnailSrc || data.thumbnailUrl || data.thumbnail_uri || data.src || data.url || data.uri;
      return ({
        id: data.id || data.url || data.uri,
        src: data.url || data.uri,
        thumbnailSrc: thumb,
        width: data.width,
        height: data.height,
      });
    },

    /**
     * Delete image
     * @param {string} id id or url of image
     * @return {Promise<IRedaxtorResource>}
     */
    deleteImage: urls.deleteImageUrl ? async (id) => {
      // formData is FormData with image field. Add rest to formData if needed and submit.
      const data = await fetchApi.post(urls.deleteImageUrl!, { id });
      return ({
        id: data.id || data.url || data.uri,
      });
    } : undefined,
  };

  const writeaway = new WriteAwaySpiralBundle({
    ...defaultOptions,
    piecesOptions: {
      ...defaultPieces,
      components,
    },
    pieceNameGroupSeparator: ':',
    options: options || {},
    api: spiralApi,
  });

  writeaway.attachSeo({
    header: seoHtml || globMeta()?.html || globMeta()?.header || '',
  });

  (window as any)[VAR_WA] = writeaway;

  return writeaway;
};
