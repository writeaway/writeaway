import { IPieceProps } from '@writeaway/core';
import { boundMethod } from 'autobind-decorator';
import React, { Component } from 'react';
import Codemirror from 'react-codemirror';
import { html as html_beautify } from 'js-beautify';
import Modal from 'react-modal';

require('codemirror/mode/htmlmixed/htmlmixed');

export default class CodeMirror extends Component<IPieceProps> {
  /**
   * Specify component should be rendered inside target node and capture all inside html
   * @type {string}
   */
  static readonly __renderType = 'BEFORE';

  static readonly editLabel = 'Edit Source Code';

  static readonly label = 'Source code';

  static readonly applyEditor = function (node: HTMLElement, data: { updateNode: boolean, html: string }) {
    if (node) {
      const content = node.innerHTML;
      const needRender = data.updateNode ?? true;
      if (content !== data.html && needRender) {
        node.innerHTML = data.html;
        return true;
      }
    }
    return false;
  };

  private beautifyOptions: { wrap_line_length: number } = {
    wrap_line_length: 140,
  };

  state: {
    sourceEditorActive: boolean
  } = {
    sourceEditorActive: false,
  };

  private modalNode!: HTMLElement;

  private initDataKeys: string[];
  private nodeWasUpdated: boolean = false;
  private code: string = '';

  constructor(props: IPieceProps) {
    super(props);
    // this.code = this.props.piece.data && this.props.piece.data.html;

    if (this.props.piece.data) {
      this.initDataKeys = Object.keys(this.props.piece.data);
    } else {
      this.initDataKeys = [];
    }
  }

  setEditorActive(active: boolean) {
    if (active !== this.state.sourceEditorActive) {
      this.setState({ sourceEditorActive: active });
      this.props.actions.onEditorActive && this.props.actions.onEditorActive(this.props.piece.id, active);
    }
  }

  /**
   * That is a common public method that should activate component editor if it presents
   */
  activateEditor() {
    if (this.props.editorActive && !this.state.sourceEditorActive) {
      this.setEditorActive(true);
    }
  }

  deactivateEditor() {
    if (this.props.editorActive && this.state.sourceEditorActive) {
      this.setEditorActive(false);
    }
  }

  componentWillReceiveProps(newProps: IPieceProps) {
    if (newProps.piece.manualActivation) {
      this.props.actions.onManualActivation(this.props.piece.id);
      this.activateEditor();
    }
    if (newProps.piece.manualDeactivation) {
      this.props.actions.onManualDeactivation(this.props.piece.id);
      this.deactivateEditor();
    }
  }

  componentDidUpdate() {
    if (this.nodeWasUpdated && this.props.actions.onNodeResized) {
      this.props.actions.onNodeResized(this.props.piece.id);
    }
  }

  componentWillUnmount() {
    // console.log(`Code mirror ${this.props.piece.id} unmounted`);
  }

  @boundMethod
  updateCode(newCode: string) {
    this.code = newCode;
  }

  shouldComponentUpdate(nextProps: IPieceProps) {
    const { data } = this.props.piece;
    if (data) {
      const needRender = data.updateNode ?? true;
      if (!needRender && nextProps.piece.data !== data) {
        let isChanged: boolean = false;
        this.initDataKeys.forEach((key: string) => {
          isChanged = isChanged && (nextProps.piece.data[key] !== this.props.piece.data[key]);
        });
        if (this.props.actions.setPieceMessage) {
          this.props.actions.setPieceMessage(this.props.piece.id, 'Page refresh is required', 'warning')
        }
      }
    }
    return true;
  }

  onSave() {
    if (this.props.onSave) {
      this.props.onSave(this.code)
    }
    if (this.props.actions.updatePiece) {
      this.props.actions.updatePiece(this.props.piece.id, {
        data: {
          html: this.code,
          updateNode: this.props.piece.data.updateNode,
        },
      });
    }
    if (this.props.actions.savePiece) {
      this.props.actions.savePiece(this.props.piece.id);
    }
    this.setEditorActive(false);
  }

  @boundMethod
  onClose() {
    if (this.props.piece.node) {
      this.setEditorActive(false);
    } else {
      (this.props.onClose && this.props.onClose());
    }
  }

  createEditor() {
    // this.props.node
    if (this.props.piece.node) {
      this.props.piece.node.addEventListener('click', this.onClick);
    }
  }

  destroyEditor() {
    if (this.props.piece.node) {
      this.props.piece.node.removeEventListener('click', this.onClick);
    }
  }

  renderNonReactAttributes() {
    if (this.props.editorActive && !this.state.sourceEditorActive) {
      this.createEditor();
      if (this.props.piece.node) {
        this.props.piece.node.classList.add(...(this.props.className || '').split(' '));
      }
    } else {
      this.destroyEditor();
      if (this.props.piece.node) {
        this.props.piece.node.classList.remove(...(this.props.className || '').split(' '));
      }
    }
    // render new data
    this.nodeWasUpdated = CodeMirror.applyEditor(this.props.piece.node, this.props.piece.data);
  }

  @boundMethod
  onClick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.setEditorActive(true);
  }

  @boundMethod
  handleCloseModal(event: KeyboardEvent) {
    if (event.type === 'keydown' && event.keyCode === 27 && this.modalNode) {
      this.modalNode.parentNode!.dispatchEvent(new KeyboardEvent('keyDown', { key: 'Escape' }));
    }
  }

  render() {
    let codemirror: any = null;
    if (this.state.sourceEditorActive || !this.props.piece.node) {
      // if there is no this.props.node, it means this component is invoked manually with custom html directly in props and should be just rendered
      // if this.state.sourceEditorActive and this.props.node presents, it means that is a regular piece with control over node and sourceEditorActive means modal is open
      const options = {
        lineNumbers: true,
        mode: 'htmlmixed',
      };
      const { html } = this.props.piece.data;
      codemirror = (
        <Modal
          contentLabel="Edit source"
          isOpen
          overlayClassName="r_modal-overlay r_reset r_visible"
          className="r_modal-content"
          ref={(modal) => this.modalNode = (modal && modal.node)}
          onRequestClose={this.handleCloseModal}
        >
          <div className="r_modal-title">
            <div className="r_modal-close" onClick={this.onClose}>
              <i className="rx_icon rx_icon-close">&nbsp;</i>
            </div>
            <span>Edit Source Code</span>
          </div>
          <Codemirror
            value={html_beautify(html)}
            onChange={this.updateCode}
            options={options}
          />
          <div className="r_modal-actions-bar">
            <div
              className="button button-save"
              onClick={this.onSave}
            >
              Save
            </div>
          </div>
        </Modal>
      );
    } else {
      codemirror = React.createElement(this.props.wrapper, {});
    }

    this.renderNonReactAttributes();
    return codemirror;
  }
}
