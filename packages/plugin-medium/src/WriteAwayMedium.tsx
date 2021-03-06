import { IPieceProps, Rect } from '@writeaway/core';
import { boundMethod } from 'autobind-decorator';
import ImageManager from 'imageManager/ImageManager';
import React, { Component } from 'react';
import { WriteAwayImageData } from 'types';
import _MediumEditor from './HTMLEditor';
import i18n from './i18n';
import { imageManagerApi } from './imageManager/index';

export interface WriteAwayMediumState { codeEditorActive: boolean }

export default class WriteAwayMedium extends Component<IPieceProps, WriteAwayMediumState> {
  /**
   * Specify component should be rendered inside target node and capture all inside html
   * @type {string}
   */
  static readonly __renderType = 'BEFORE';

  static readonly editLabel = i18n.richText.floatingEditLabel;

  static readonly label = i18n.richText.checkboxName;

  static readonly applyEditor = (node: HTMLElement, data: { html: string }) => {
    if (node) {
      const content = node.innerHTML;
      if (content !== data.html) {
        // eslint-disable-next-line no-param-reassign
        node.innerHTML = data.html;
        return true;
      }
    }
    return false;
  };

  // eslint-disable-next-line react/state-in-constructor,react/no-unused-state
  state = { codeEditorActive: false };

  private rect?: Rect;

  private imageManagerApi: ImageManager | null = null;

  private savedRange?: Range;

  private img?: HTMLImageElement;

  private medium: any;

  private editorData?: string;

  private nodeWasUpdated: boolean = false;

  get piece() {
    return this.props.piece;
  }

  get actions() {
    return this.props.actions;
  }

  componentDidMount() {
    imageManagerApi({
      api: this.props.api,
      container: this.props.wrapper,
      ref: (i: ImageManager | null) => {
        this.imageManagerApi = i;
      },
    });
    const nodeRect = this.props.api.getNodeRect(this.piece);
    this.rect = nodeRect.hover || nodeRect.node;
  }

  saveSelection() {
    this.savedRange = window.getSelection()?.getRangeAt(0);
  }

  restoreSelection() {
    if (this.savedRange) {
      const s = window.getSelection();
      if (s) {
        s.removeAllRanges();
        s.addRange(this.savedRange);
      }
    }
  }

  onToggleImagePopup() {
    let imageData: WriteAwayImageData = {};
    if (this.img) {
      imageData = {
        src: this.img.getAttribute('src') || '',
        alt: this.img.getAttribute('alt') || '',
        title: this.img.getAttribute('title') || '',
        width: this.img.width,
        height: this.img.height,
      };
    }

    if (!this.imageManagerApi) {
      throw new Error('Trying to toggle popup with non existing ImageManager');
    }
    this.imageManagerApi.setImageData({
      data: {
        ...imageData,
      },
      pieceRef: {
        type: this.piece.type,
        data: this.piece.data,
        id: this.piece.id,
        dataset: this.piece.dataset,
      },
      onClose: this.cancelCallback,
      onSave: this.saveCallback,
      settings: {
        editDimensions: true,
        editBackground: false,
      },
    });

    this.medium.editor.saveSelection();
    this.imageManagerApi.showPopup();
  }

  @boundMethod
  saveCallback(data: WriteAwayImageData) {
    this.medium.editor.restoreSelection();

    if (this.img) {
      this.img.src = data.src || '';
      this.img.alt = data.alt || '';
      this.img.title = data.title || '';
      this.img.style.width = `${data.width}px`;
      this.img.style.height = `${data.height}px`;
      this.img = undefined;
    } else {
      const html = [`src="${data.src}"`];
      if (data.width && data.height) {
        html.push(`style="width: ${data.width}px; height: ${data.height}px"`);
      }
      if (data.alt) {
        html.push(`alt="${encodeURIComponent(data.alt)}"`);
      }
      if (data.title) {
        html.push(`title="${encodeURIComponent(data.title)}"`);
      }
      this.medium.editor.pasteHTML(`<img ${html.join(' ')}/>`);
      this.medium.onChange();
    }
    this.props.actions.updatePiece(this.piece.id, { data: { html: this.medium.editor.getContent() } });
  }

  @boundMethod
  cancelCallback() {
    this.medium.editor.restoreSelection();
  }

  /**
     * Handle clicking on image in html
     * @param e
     */
  @boundMethod
  onClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    e.preventDefault();
    e.stopPropagation();

    if (target.tagName.toLowerCase() !== 'img') {
      this.img = undefined;
    } else {
      this.img = e.target as HTMLImageElement;
    }
    if (target.tagName.toLowerCase() !== 'img') return;
    const sel = window.getSelection();
    const range = document.createRange();
    range.selectNode(target);
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  createEditor() {
    const dom = this.piece.node;
    this.editorData = undefined;
    // const dom = ReactDOM.findDOMNode(this);
    this.medium = new _MediumEditor(dom, {
      onUpdate: () => {
        this.checkifResized();
        this.props.actions.updatePiece(this.piece.id, { data: { html: this.medium ? this.medium.getEditorContent() : this.editorData } });
      },
      onNeedResizeCheck: () => {
        this.checkifResized();
      },
      onSave: () => {
        this.props.actions.savePiece(this.props.piece.id);
      },
      onLeave: () => {
        /* if(resetCallback) {
                 if(confirm("Save changes?")) {
                 this.props.savePiece(this.piece.id);
                 } else {
                 resetCallback();
                 this.props.resetPiece(this.piece.id);
                 }
                 } else {
                 //
                 } */
        this.props.actions.savePiece(this.props.piece.id);
      },
      __getBoundingRect: () => {
        const nodeRect = this.props.api.getNodeRect(this.props.piece);
        return nodeRect.hover || nodeRect.node;
      },
      onSetCurrentSourcePieceId: () => {
        this.props.actions.setCurrentSourcePieceId(this.props.piece.id);
      },
      onToggleImagePopup: this.onToggleImagePopup.bind(this),
      pickerColors: this.props.options.pickerColors,
      i18n: i18n.medium,
      onEditorActive: (active: boolean) => {
        if (this.props.actions.onEditorActive) {
          this.props.actions.onEditorActive(this.props.piece.id, active);
        }
      },
    });
    this.piece.node.addEventListener('click', this.onClick);
  }

  shouldComponentUpdate(nextProps: IPieceProps) {
    if (nextProps.editorActive !== this.props.editorActive) {
      return true;
    }
    if (nextProps.expert !== this.props.expert) {
      return true;
    }
    return nextProps.piece.data?.html !== this.props.piece.data?.html;
  }

  destroyEditor() {
    if (this.medium) {
      this.editorData = this.medium.getEditorContent();
      this.medium.destroy();
      this.piece.node.removeEventListener('click', this.onClick);
      delete this.medium;
    }
  }

  /**
     * Updates rendering of props that are not updated by react
     * Here that updates styles of background
     */
  renderNonReactAttributes(data?: { html: string }) {
    // console.log('Re-Rendered?', this.piece.id);
    if (this.props.editorActive) {
      if (!this.medium) {
        this.createEditor();
        this.props.piece.node.classList.add(...(this.props.className || '').split(' '));
      }
    } else {
      this.props.piece.node.classList.remove(...(this.props.className || '').split(' '));

      // the destroyEditor method called also from  the shouldComponentUpdate method and this. medium can not exist here
      if (this.medium) {
        this.destroyEditor();
      }
    }

    this.nodeWasUpdated = false;
    if (this.medium) {
      const content = this.medium.getEditorContent();
      if (data) {
        if (content !== data.html) {
          // console.log('Re-Rendered HARD', this.piece.id);
          this.medium.editor.setContent(data.html);
          this.nodeWasUpdated = true;
        }
      }

      const toolbar = this.medium.editor.getExtensionByName('toolbar');
      if (this.props.expert) {
        toolbar.toolbar.classList.remove('rx_non-expert');
      } else {
        toolbar.toolbar.classList.add('rx_non-expert');
      }
    } else if (data) {
      this.nodeWasUpdated = WriteAwayMedium.applyEditor(this.piece.node, data);
    }
  }

  componentWillUnmount() {
    this.destroyEditor();
  }

  componentDidUpdate() {
    this.checkifResized();
  }

  checkifResized() {
    const nodeRect = this.props.api.getNodeRect(this.piece);
    const rect = nodeRect.hover || nodeRect.node;
    if (this.changedBoundingRect(rect)) {
      this.setBoundingRect(rect);
      if (this.props.actions.onNodeResized) {
        this.props.actions.onNodeResized(this.piece.id);
      }
    }
  }

  /**
     * Check if node size is different
     * @param rect {ClientRect}
     */
  changedBoundingRect(rect: Rect) {
    return !this.rect
            || this.rect.top !== rect.top
            || this.rect.left !== rect.left
            || this.rect.bottom !== rect.bottom
            || this.rect.right !== rect.right;
  }

  /**
     * Store node size
     * @param rect {ClientRect}
     */
  setBoundingRect(rect: Rect) {
    this.rect = rect;
  }

  render() {
    this.renderNonReactAttributes(this.piece.data);
    return <div data-editor-for={this.piece.name} />;
  }
}
