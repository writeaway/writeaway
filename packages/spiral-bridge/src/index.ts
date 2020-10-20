import { defaultMinimumApi as BasicApi, IOptions, WriteAwayCore } from '@writeaway/core';
import { WriteAwaySeoData } from '@writeaway/plugin-seo';
import { boundMethod } from 'autobind-decorator';
import {
  getCookie, globMeta, setCookie, VAR_E_ACTIVE, VAR_E_COLLAPSED, VAR_E_EXPERT,
} from 'persist';
import { startForSpiral } from 'startForSpiral';
import { useSpiralWS } from 'concurrent';

import 'style.less';

/**
 * WriteAway bundle specific for SpiralScout
 */
export class WriteAwaySpiralBundle extends WriteAwayCore {
  static startForSpiral = startForSpiral;

  /**
   * Attaches invisible div handling SEO editing
   */
  attachSeo(data: Partial<WriteAwaySeoData>) {
    setTimeout(() => {
      const div = document.createElement('div');
      const meta = globMeta();

      if (meta && meta['meta-save-url']) {
        div.setAttribute('data-save-url', meta['meta-save-url']);
        // delete meta['meta-save-url'];
      }

      if (data && (data as any)['meta-save-url']) {
        div.setAttribute('data-save-url', (data as any)['meta-save-url']); // TODO: deprecate
        // delete data['meta-save-url'];
      }

      div.innerHTML = 'Edit SEO Meta';
      div.className = 'edit-seo-div';
      div.style.display = 'none';
      this.addPiece<WriteAwaySeoData>(div, {
        id: 'seo',
        name: 'Edit SEO',
        type: 'seo',
        data: {
          header: data?.header || '',
          title: data?.title || document.querySelector('title')?.innerHTML || '',
          description: data?.description || document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
          keywords: data?.keywords || document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '',
        },
      });
      document.querySelector('body')!.appendChild(div);
    });
  }

  /**
   * Constructor
   * @param {IOptions} options
   */
  constructor(options: IOptions) {
    WriteAwaySpiralBundle.checkHtmlPiecesCompartibility(document);
    super(options);

    if (options.editorActive ?? false) {
      this.setEditorActive(getCookie(VAR_E_ACTIVE) === 'true');
    }
    if (options.navBarCollapsed ?? false) {
      this.setNavBarCollapsed(getCookie(VAR_E_COLLAPSED) === 'true');
    }
    if (options.expert ?? false) {
      this.setExpertMode(getCookie(VAR_E_EXPERT) === 'true');
    }

    window.addEventListener('beforeunload', this.beforeUnload);
  }

  /**
   * beforeUnload listner
   */
  @boundMethod
  beforeUnload() {
    setCookie(VAR_E_ACTIVE, this.isEditorActive() ? 'true' : '');
    setCookie(VAR_E_COLLAPSED, this.isNavBarCollapsed() ? 'true' : '');
    setCookie(VAR_E_EXPERT, this.isExpertMode() ? 'true' : '');
  }

  /**
   * Scans html pieces for invalid internal html and reverts them to source editor if needed
   */
  static checkHtmlPiecesCompartibility(node: Element | Document) {
    /**
     * In Spiral html pieces are marked up as data-piece="html", collect them
     */
    const pieces = node.querySelectorAll('[data-piece="html"]');
    for (let i = 0; i < pieces.length; i += 1) {
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

export const defaultApi = BasicApi;

export const start = startForSpiral;

export const useWS = useSpiralWS;

export default WriteAwaySpiralBundle;
