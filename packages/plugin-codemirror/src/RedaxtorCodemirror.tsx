import { IPieceProps } from '@writeaway/core';
import { boundMethod } from 'autobind-decorator';

import { html as html_beautify } from 'js-beautify';
import React, { Component } from 'react';
import Modal from 'react-modal';
import { RedaxtorCodeMirrorData, RedaxtorCodeMirrorState } from 'types';

import Editor from 'react-simple-code-editor';
// @ts-ignore
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-javascript';

export default class CodeMirror extends Component<IPieceProps<RedaxtorCodeMirrorData>, RedaxtorCodeMirrorState> {
  /**
   * Specify component should be rendered inside target node and capture all inside html
   * @type {string}
   */
  static readonly __renderType = 'BEFORE';

  static readonly editLabel = 'Edit Source Code';

  static readonly label = 'Source code';

  static readonly applyEditor = (node: HTMLElement, data: RedaxtorCodeMirrorData) => {
    if (node) {
      const content = node.innerHTML;
      const needRender = data.updateNode ?? true;
      if (content !== data.html && needRender) {
        // eslint-disable-next-line no-param-reassign
        node.innerHTML = data.html;
        return true;
      }
    }
    return false;
  };

  private beautifyOptions: { wrap_line_length: number } = {
    wrap_line_length: 140,
  };

  // eslint-disable-next-line react/state-in-constructor
  state: RedaxtorCodeMirrorState;

  private modalNode!: HTMLElement;

  private initDataKeys: Array<keyof RedaxtorCodeMirrorData>;

  private nodeWasUpdated: boolean = false;

  private code: string = '';

  constructor(props: IPieceProps) {
    super(props);

    if (this.props.piece.data) {
      this.initDataKeys = Object.keys(this.props.piece.data) as Array<keyof RedaxtorCodeMirrorData>;
    } else {
      this.initDataKeys = [];
    }

    this.state = {
      sourceEditorActive: false,
      html: this.props.piece.data?.html || '',
    };
  }

  UNSAFE_componentWillReceiveProps(newProps: IPieceProps) {
    if (newProps.piece.manualActivation) {
      this.props.actions.onManualActivation(this.props.piece.id);
      this.activateEditor();
    }
    if (newProps.piece.manualDeactivation) {
      this.props.actions.onManualDeactivation(this.props.piece.id);
      this.deactivateEditor();
    }
    this.setState({ html: html_beautify(newProps.piece.data?.html || '', this.beautifyOptions) });
  }

  shouldComponentUpdate(nextProps: IPieceProps) {
    const { data } = this.props.piece;
    if (data) {
      const needRender = data.updateNode ?? true;
      if (!needRender && nextProps.piece.data !== data) {
        let isChanged: boolean = false;
        this.initDataKeys.forEach((key) => {
          isChanged = isChanged && (nextProps.piece.data![key] !== this.props.piece.data![key]);
        });
        if (this.props.actions.setPieceMessage) {
          this.props.actions.setPieceMessage(this.props.piece.id, 'Page refresh is required', 'warning');
        }
      }
    }
    return true;
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
  updateCode(value: string) {
    this.setState({ html: value });
  }

  @boundMethod
  onSave() {
    if (this.props.onSave) {
      this.props.onSave(this.code);
    }
    if (this.props.actions.updatePiece) {
      this.props.actions.updatePiece(this.props.piece.id, {
        data: {
          html: html_beautify(this.state.html, this.beautifyOptions),
          updateNode: !!this.props.piece.data?.updateNode,
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
    }
    if (this.props.onClose) {
      this.props.onClose();
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
    if (this.props.piece.data) {
      // render new data
      this.nodeWasUpdated = CodeMirror.applyEditor(this.props.piece.node, this.props.piece.data!);
    }
  }

  @boundMethod
  onClick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.setEditorActive(true);
  }

  setEditorActive(active: boolean) {
    if (active !== this.state.sourceEditorActive) {
      this.setState({ sourceEditorActive: active });
      if (this.props.actions.onEditorActive) {
        this.props.actions.onEditorActive(this.props.piece.id, active);
      }
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

  @boundMethod
  handleCloseModal(event: React.MouseEvent | React.KeyboardEvent) {
    if (event.type === 'keydown' && (event as React.KeyboardEvent).keyCode === 27 && this.modalNode) {
      this.modalNode.parentNode!.dispatchEvent(new KeyboardEvent('keyDown', { key: 'Escape' }));
    }
  }

  render() {
    let codemirror: any = null;
    // if there is no this.props.node, it means this component is invoked manually with custom html directly in props and should be just rendered
    // if this.state.sourceEditorActive and this.props.node presents,
    // it means that is a regular piece with control over node and sourceEditorActive means modal is open
    if (this.state.sourceEditorActive || !this.props.piece.node) {
      const { html } = this.state;
      codemirror = (
        <Modal
          contentLabel="Edit source"
          isOpen
          overlayClassName="r_modal-overlay r_reset r_visible"
          className="r_modal-content r_source_editor"
          ref={(modal: any) => { this.modalNode = (modal && modal.node); }}
          onRequestClose={this.handleCloseModal}
        >
          <div className="r_modal-title">
            <div
              role="button"
              tabIndex={-1}
              className="r_modal-close"
              onClick={this.onClose}
            >
              <i className="rx_icon rx_icon-close">&nbsp;</i>
            </div>
            <span>Edit Source Code</span>
          </div>
          <Editor
            value={html}
            onValueChange={this.updateCode}
            highlight={(code: string) => highlight(code, languages.markup)}
            padding={10}
            style={{
              fontFamily: '"Fira Code", "Menlo", monospace',
              background: 'white',
              fontSize: 12,
            }}
          />
          <div className="r_modal-actions-bar">
            <div
              role="button"
              tabIndex={-1}
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
