import { IPieceProps } from '@writeaway/core';
import { boundMethod } from 'autobind-decorator';
import ImageManager from 'imageManager/ImageManager';
import { Component } from 'react';
import { RedaxtorImageData } from 'types';
import { imageManagerApi } from './imageManager/index';

export interface RedaxtorBackgroundEditorState {
  firstRun?: boolean;
}

export default class RedaxtorBackgroundEditor extends Component<IPieceProps> {
  /**
   * Specify component should have a separate node and is not modifying insides or outsides of target node
   * @type {string}
   */
  static readonly __renderType = 'BEFORE';

  static readonly editLabel = 'Click to Edit the Background';

  static readonly label = 'Backgrounds';

  static readonly applyEditor = (node: HTMLElement, data: RedaxtorImageData) => {
    if (!node) {
      return;
    }
    // eslint-disable-next-line no-param-reassign
    node.style.backgroundImage = `url(${data.src})`;
    // eslint-disable-next-line no-param-reassign
    node.style.backgroundSize = data.bgSize || '';
    // eslint-disable-next-line no-param-reassign
    node.style.backgroundRepeat = data.bgRepeat || '';
    // eslint-disable-next-line no-param-reassign
    node.style.backgroundPosition = data.bgPosition || '';
    // eslint-disable-next-line no-param-reassign
    node.style.backgroundColor = data.bgColor || '';
    // eslint-disable-next-line no-param-reassign
    node.title = data.title || '';
  };

  // eslint-disable-next-line react/state-in-constructor
  state: RedaxtorBackgroundEditorState;

  private active: boolean;

  private targetDiv: HTMLElement;

  private imageManager: ImageManager | null = null;

  get piece() {
    return this.props.piece;
  }

  get actions() {
    return this.props.actions;
  }

  constructor(props: IPieceProps) {
    super(props);
    this.active = false;// TODO: Think how to do that more "react" way.
    // This flag allows to handle events bound to PARENT node. Ideally we should not have parent node at all.
    this.targetDiv = props.piece.node;
    this.state = {};
  }

  componentDidMount() {
    imageManagerApi({
      api: this.props.api,
      container: this.props.wrapper,
      ref: (i: ImageManager | null) => {
        this.imageManager = i;
      },
    });
    this.check();
  }

  /**
   * That is a common public method that should activate component editor if it presents
   */
  activateEditor() {
    if (this.props.editorActive && !this.imageManager?.state.isVisible) {
      this.onToggleImagePopup();
    }
  }

  deactivateEditor() {
    if (this.props.editorActive && this.imageManager?.state.isVisible) {
      this.closePopup();
    }
  }

  UNSAFE_componentWillReceiveProps(newProps: IPieceProps) {
    if (newProps.piece.manualActivation) {
      this.actions.onManualActivation(this.piece.id);
      this.activateEditor();
    }
    if (newProps.piece.manualDeactivation) {
      this.actions.onManualDeactivation(this.piece.id);
      this.deactivateEditor();
    }
  }

  onToggleImagePopup() {
    const computedStyle = getComputedStyle(this.targetDiv);
    if (!this.imageManager) {
      throw new Error('Trying to toggle popup with non existing ImageManager');
    }
    this.imageManager.setImageData({
      data: {
        src: computedStyle.backgroundImage && computedStyle.backgroundImage.slice(4, -1).replace(/"/g, ''),
        bgColor: computedStyle.backgroundColor,
        bgRepeat: computedStyle.backgroundRepeat,
        bgSize: computedStyle.backgroundSize,
        bgPosition: computedStyle.backgroundPosition,
        title: this.targetDiv.getAttribute('title') || '',
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
        editDimensions: false,
        editBackground: true,
      },
    });
    this.imageManager.showPopup();
    if (this.actions.onEditorActive) {
      this.actions.onEditorActive(this.piece.id, true);
    }
  }

  closePopup() {
    this.imageManager?.onClose();
  }

  @boundMethod
  saveCallback(data: RedaxtorImageData) {
    this.renderNonReactAttributes(data);
    this.actions.updatePiece(this.piece.id, {
      data: {
        src: data.src,
        title: data.title,
        bgSize: data.bgSize,
        bgRepeat: data.bgRepeat,
        bgPosition: data.bgPosition,
        bgColor: data.bgColor,
      },
    });
    this.actions.savePiece(this.piece.id);
    if (this.actions.onEditorActive) {
      this.actions.onEditorActive(this.piece.id, false);
    }
  }

  @boundMethod
  cancelCallback() {
    if (this.actions.onEditorActive) {
      this.actions.onEditorActive(this.piece.id, false);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  findRedaxtor(l: Element) {
    let el: Element | null = l;
    while (el && el.tagName.toLowerCase() !== 'redaxtor'
    && (!el.className || (el.className.indexOf('r_modal-overlay') === -1
      && el.className.indexOf('r_bar') === -1))) {
      el = el.parentElement;
    }
    return el;
  }

  @boundMethod
  onClick(e: MouseEvent) {
    if (this.findRedaxtor(e.target as Element)) {
      // Here we try dealing with mix of native and React events
      // We find if event was triggered within redaxtor tag
      // This can only happen when this element is wrapped in editor that needs exclusive access to element
      // Background editor is not that kind of editor so that is 100% not "our" click, so skip it
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    this.onToggleImagePopup();
  }

  /**
   * Ensures editor is enabled
   */
  componentInit() {
    if (!this.active && this.targetDiv) {
      this.targetDiv.addEventListener('click', this.onClick);
      this.targetDiv.classList.add('r_editor');
      this.targetDiv.classList.add('r_edit');
      this.active = true;
    }
  }

  shouldComponentUpdate(nextProps: IPieceProps) {
    return (nextProps.piece.data?.src !== this.piece.data?.src
      || nextProps.piece.data?.bgColor !== this.piece.data?.bgColor
      || nextProps.piece.data?.bgSize !== this.piece.data?.bgSize
      || nextProps.piece.data?.bgRepeat !== this.piece.data?.bgRepeat
      || nextProps.piece.data?.bgPosition !== this.piece.data?.bgPosition
      || nextProps.editorActive !== this.props.editorActive);
  }

  /**
   * Ensures editor is disabled
   */
  die() {
    if (this.active && this.targetDiv) {
      this.targetDiv.removeEventListener('click', this.onClick);
      this.targetDiv.classList.remove('r_editor');
      this.targetDiv.classList.remove('r_edit');
      this.active = false;
    }
  }

  /**
   * Based on external prop ensures editor is enabled or disabled and attaches-detaches non-react bindings
   */
  check() {
    if (this.props.editorActive) {
      this.componentInit();
    } else {
      this.die();
    }
  }

  /**
   * Updates rendering of props that are not updated by react
   * Here that updates styles of background
   */
  renderNonReactAttributes(data?: RedaxtorImageData) {
    if (data) {
      RedaxtorBackgroundEditor.applyEditor(this.targetDiv, data);
    }
  }

  componentWillUnmount() {
    this.die();
  }

  render() {
    this.check();
    this.renderNonReactAttributes(this.piece.data);
    return null;
  }
}
