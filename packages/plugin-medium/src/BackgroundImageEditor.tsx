import { IPieceProps } from '@writeaway/core';
import { boundMethod } from 'autobind-decorator';
import ImageManager from 'imageManager/ImageManager';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { RedaxtorImageData } from 'types';
import { imageManagerApi } from './imageManager/index';

export interface RedaxtorBackgroundEditorState {
  firstRun: boolean;
}

export default class RedaxtorBackgroundEditor extends Component<IPieceProps> {
  /**
   * Specify component should have a separate node and is not modifying insides or outsides of target node
   * @type {string}
   */
  static readonly __renderType = 'BEFORE';

  static readonly editLabel = 'Click to Edit the Background';

  static readonly label = 'Backgrounds';

  static readonly applyEditor = function (node: HTMLElement, data: RedaxtorImageData) {
    if (!node) {
      return;
    }
    node.style.backgroundImage = `url(${data.src})`;
    node.style.backgroundSize = data.bgSize || '';
    node.style.backgroundRepeat = data.bgRepeat || '';
    node.style.backgroundPosition = data.bgPosition || '';
    node.style.backgroundColor = data.bgColor || '';
    node.title = data.title || '';
  };

  state: RedaxtorBackgroundEditorState = { firstRun: true };

  private active: boolean;

  private targetDiv: HTMLElement;

  private imageManager?: ImageManager;

  get piece() {
    return this.props.piece;
  }

  get actions() {
    return this.props.actions;
  }

  constructor(props: IPieceProps) {
    super(props);
    this.active = false;// TODO: Think how to do that more "react" way. This flag allows to handle events bound to PARENT node. Ideally we should not have parent node at all.
    this.targetDiv = props.node;
  }

  componentDidMount() {
    this.imageManager = imageManagerApi({
      api: this.props.api,
      container: ReactDOM.findDOMNode(this) as Element,
    });
    this.check();
  }

  /**
   * That is a common public method that should activate component editor if it presents
   */
  activateEditor() {
    if (this.props.editorActive && !this.imageManager!.state.isVisible) {
      this.onToggleImagePopup();
    }
  }

  deactivateEditor() {
    if (this.props.editorActive && this.imageManager!.state.isVisible) {
      this.closePopup();
    }
  }

  componentWillReceiveProps(newProps: IPieceProps) {
    if (newProps.piece.manualActivation) {
      this.actions.onManualActivation(this.props.id);
      this.activateEditor();
    }
    if (newProps.piece.manualDeactivation) {
      this.actions.onManualDeactivation(this.props.id);
      this.deactivateEditor();
    }
  }

  onToggleImagePopup() {
    const computedStyle = getComputedStyle(this.targetDiv);
    this.imageManager!.setImageData({
      data: {
        src: computedStyle.backgroundImage && computedStyle.backgroundImage.slice(4, -1).replace(/"/g, ''),
        bgColor: computedStyle.backgroundColor,
        bgRepeat: computedStyle.backgroundRepeat,
        bgSize: computedStyle.backgroundSize,
        bgPosition: computedStyle.backgroundPosition,
        title: this.targetDiv.getAttribute('title') || '',
      },
      pieceRef: {
        type: this.props.type,
        data: this.props.data,
        id: this.props.id,
        dataset: this.props.dataset,
      },
      onClose: this.cancelCallback.bind(this),
      onSave: this.saveCallback.bind(this),
      settings: {
        editDimensions: false,
        editBackground: true,
      },
    });
    this.imageManager!.showPopup();
    this.actions.onEditorActive && this.actions.onEditorActive(this.props.id, true);
  }

  closePopup() {
    this.imageManager!.onClose();
  }

  saveCallback(data: RedaxtorImageData) {
    this.renderNonReactAttributes(data);
    this.actions.updatePiece(this.props.id, {
      data: {
        src: data.src,
        title: data.title,
        bgSize: data.bgSize,
        bgRepeat: data.bgRepeat,
        bgPosition: data.bgPosition,
        bgColor: data.bgColor,
      },
    });
    this.actions.savePiece(this.props.id);
    this.actions.onEditorActive && this.actions.onEditorActive(this.props.id, false);
  }

  cancelCallback() {
    this.actions.onEditorActive && this.actions.onEditorActive(this.props.id, false);
  }

  findRedaxtor(_el: Element) {
    let el: Element | null = _el;
    while (el && el.tagName.toLowerCase() != 'redaxtor' && (!el.className || (el.className.indexOf('r_modal-overlay') == -1 && el.className.indexOf('r_bar') == -1))) {
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

  shouldComponentUpdate(nextProps: IPieceProps, nextState: RedaxtorBackgroundEditorState) {
    return (nextProps.data.src !== this.props.data.src
      || nextProps.data.bgColor !== this.props.data.bgColor
      || nextProps.data.bgSize !== this.props.data.bgSize
      || nextProps.data.bgRepeat !== this.props.data.bgRepeat
      || nextProps.data.bgPosition !== this.props.data.bgPosition
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
  renderNonReactAttributes(data: RedaxtorImageData) {
    RedaxtorBackgroundEditor.applyEditor(this.targetDiv, data);
  }

  componentWillUnmount() {
    this.die();
    console.log(`Background editor ${this.props.id} unmounted`);
  }

  render() {
    this.check();
    this.renderNonReactAttributes(this.props.data);
    return React.createElement(this.props.wrapper, {});
  }
}
