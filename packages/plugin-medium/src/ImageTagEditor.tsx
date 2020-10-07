import { boundMethod } from 'autobind-decorator';
import ImageManager from 'imageManager/ImageManager';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import type { IPieceProps, Rect } from '@writeaway/core';
import { RedaxtorImageTagData } from 'types';
import { imageManagerApi } from './imageManager/index';

export default class RedaxtorImageTag extends Component<IPieceProps> {
  /**
     * Specify component should have a separate node and is not modifying insides or outsides of target node
     * @type {string}
     */
  static readonly __renderType: string = 'BEFORE';

  static readonly editLabel: string = 'Click to Edit Image';

  static readonly label: string = 'Images';

  static readonly applyEditor = (node: HTMLImageElement, data: RedaxtorImageTagData) => {
    if (!node) { return; }
    node.src = data.src || '';
    node.alt = data.alt || '';
    node.setAttribute('title', data.title || '');
  };

  private active: boolean; // TODO: Refactor to store in state?

  private rect?: Rect; // TODO: Refactor to store in state?

  private imageManagerApi?: ImageManager;

  constructor(props: IPieceProps) {
    super(props);

    if (this.piece.node.nodeName !== 'IMG') {
      throw new Error('Image editor should be set on image');
    }

    this.state = { firstRun: true };
    this.active = false;// TODO: Think how to do that more "react" way. This flag allows to handle events bound to PARENT node. Ideally we should not have parent node at all.
  }

  get piece() {
    return this.props.piece;
  }

  get actions() {
    return this.props.actions;
  }

  /**
     * That is a common public method that should activate component editor if it presents
     */
  activateEditor() {
    if (this.props.editorActive && this.imageManagerApi!.state.isVisible) {
      this.onToggleImagePopup();
    }
  }

  deactivateEditor() {
    if (this.props.editorActive && this.imageManagerApi!.state.isVisible) {
      this.closePopup();
    }
  }

  componentWillReceiveProps(newProps: IPieceProps) {
    if (newProps.piece.manualActivation) {
      this.props.actions.onManualActivation(this.piece.id);
      this.activateEditor();
    }
    if (newProps.piece.manualDeactivation) {
      this.props.actions.onManualDeactivation(this.piece.id);
      this.deactivateEditor();
    }
  }

  componentDidMount() {
    this.imageManagerApi = imageManagerApi({
      api: this.props.api,
      container: ReactDOM.findDOMNode(this) as HTMLElement,
    });
    this.check();
    const nodeRect = this.props.api.getNodeRect(this.piece);
    this.rect = nodeRect.hover || nodeRect.node;
  }

  onToggleImagePopup() {
    this.imageManagerApi!.setImageData({
      data: {
        src: (this.piece.node as HTMLImageElement).src,
        alt: (this.piece.node as HTMLImageElement).alt || '',
        title: this.piece.node.getAttribute('title') || '',
        width: (this.piece.node as HTMLImageElement).width,
        height: (this.piece.node as HTMLImageElement).height,
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
        editBackground: false,
      },
    });
    this.imageManagerApi!.showPopup();
    this.actions.onEditorActive && this.actions.onEditorActive(this.piece.id, true);
  }

  closePopup() {
    this.imageManagerApi!.onClose();
  }

  @boundMethod
  saveCallback(data: RedaxtorImageTagData) {
    this.actions.updatePiece(this.piece.id, { data: { src: data.src, alt: data.alt, title: data.title } });
    this.actions.savePiece(this.piece.id);
    this.actions.onEditorActive && this.actions.onEditorActive(this.piece.id, false);
  }

  @boundMethod
  cancelCallback() {
    this.actions.onEditorActive && this.actions.onEditorActive(this.piece.id, false);
  }

  @boundMethod
  onClick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.onToggleImagePopup();
  }

  /**
     * Ensures editor is enabled
     */
  componentInit() {
    if (!this.active && this.piece.node) {
      this.piece.node.addEventListener('click', this.onClick);
      this.piece.node.classList.add('r_editor');
      this.piece.node.classList.add('r_edit');
      this.active = true;
    }
  }

  shouldComponentUpdate(nextProps: IPieceProps & {data: RedaxtorImageTagData}, nextState: IPieceProps & {data: RedaxtorImageTagData}) {
    return (nextProps.data.src !== (this.piece.node as HTMLImageElement).src
        || nextProps.data.alt !== (this.piece.node as HTMLImageElement).alt
        || nextProps.data.title !== this.piece.node.title
        || nextProps.editorActive !== this.props.editorActive);
  }

  /**
     * Ensures editor is disabled
     */
  die() {
    if (this.active && this.piece.node) {
      this.piece.node.removeEventListener('click', this.onClick);
      this.piece.node.classList.remove('r_editor');
      this.piece.node.classList.remove('r_edit');
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
     * Here that updates IMG tag src and alt
     */
  renderNonReactAttributes(data: RedaxtorImageTagData) {
    RedaxtorImageTag.applyEditor((this.piece.node as HTMLImageElement), data);
  }

  componentWillUnmount() {
    this.die();
    console.log(`Image editor ${this.piece.id} unmounted`);
  }

  render() {
    this.check();
    this.renderNonReactAttributes(this.piece.data);
    return React.createElement(this.props.wrapper, {});
  }

  componentDidUpdate() {
    this.checkifResized();
  }

  checkifResized() {
    const nodeRect = this.props.api.getNodeRect(this.piece);
    const rect = nodeRect.hover || nodeRect.node;
    if (this.changedBoundingRect(rect)) { // TODO was checking 'this.nodeWasUpdated' here that is never changed anywhere
      this.setBoundingRect(rect);
      this.props.actions.onNodeResized && this.props.actions.onNodeResized(this.piece.id); // TODO: onNodeResized is never used anywhere
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
}
