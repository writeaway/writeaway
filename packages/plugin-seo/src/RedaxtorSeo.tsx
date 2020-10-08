import React, {Component} from "react"
import Codemirror from 'react-codemirror'
import {html as html_beautify} from 'js-beautify'
import Modal from 'react-modal'
require('codemirror/mode/htmlmixed/htmlmixed');
var shallowEqual = require('fbjs/lib/shallowEqual');
import i18n from './i18n';

const TITLE_FIELD = "title";
const KEYWORDS_FIELD = "keywords";
const DESCRIPTION_FIELD = "description";
const HEADER_HTML_FIELD = "html";

const VALS = [TITLE_FIELD, KEYWORDS_FIELD, DESCRIPTION_FIELD, HEADER_HTML_FIELD];

export default class RedaxtorSeo extends Component {
    constructor(props) {
        super(props);

        this.onClickBound = this.onClick.bind(this);

        this.beautifyOptions = {
            "wrap_line_length": 140
        };

        this.state = {
            [TITLE_FIELD]: this.props.data[TITLE_FIELD] || "",
            [KEYWORDS_FIELD]: this.props.data[KEYWORDS_FIELD] || "",
            [DESCRIPTION_FIELD]: this.props.data[DESCRIPTION_FIELD] || "",
            [HEADER_HTML_FIELD]: this.props.data[HEADER_HTML_FIELD] || "",
            sourceEditorActive: false
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


    setEditorActive(active) {
        if (active != this.state.sourceEditorActive) {
            this.setState({sourceEditorActive: active});
            this.props.onEditorActive && this.props.onEditorActive(this.props.id, active);
        }
    }

    onClick(e) {
        e.preventDefault();
        this.setState({sourceEditorActive: true});
    }

    componentWillUnmount() {
        console.log(`SEO editor ${this.props.id} unmounted`);
    }

    updateCode(newCode) {
        this.updateValue(HEADER_HTML_FIELD, newCode);
    }

    componentWillReceiveProps(nextProps) {

        // Props are always superior to state

        this.setState({
            [TITLE_FIELD]: nextProps.data[TITLE_FIELD] || "",
            [KEYWORDS_FIELD]: nextProps.data[KEYWORDS_FIELD] || "",
            [DESCRIPTION_FIELD]: nextProps.data[DESCRIPTION_FIELD] || "",
            [HEADER_HTML_FIELD]: nextProps.data[HEADER_HTML_FIELD] || "",
        });

        if (nextProps.manualActivation) {
            this.props.onManualActivation(this.props.id);
            this.activateEditor();
        }

        if (nextProps.manualDeactivation) {
            this.props.onManualDeactivation(this.props.id);
            this.deactivateEditor();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.data) {
            if (nextProps.data != this.props.data) {
                this.props.setPieceMessage && this.props.setPieceMessage(this.props.id, 'Page refresh is required', 'warning');
            }
        }
        return !shallowEqual(nextProps.data, this.props.data)
            || this.props.editorActive != nextProps.editorActive
            || !shallowEqual(this.state, nextState);
    }

    /**
     * Update a current value in the temp state
     * @param valueKey
     * @param value
     */
    updateValue(valueKey, value) {
        if (VALS.indexOf(valueKey) == -1) {
            console.error("Unknown field ", valueKey, value);
        } else {
            this.setState({[valueKey]: (value || "").trim()});
        }
    }

    onSave() {
        this.props.updatePiece && this.props.updatePiece(this.props.id,
            {
                data: {
                    [TITLE_FIELD]: this.state[TITLE_FIELD] || "",
                    [KEYWORDS_FIELD]: this.state[KEYWORDS_FIELD] || "",
                    [DESCRIPTION_FIELD]: this.state[DESCRIPTION_FIELD] || "",
                    [HEADER_HTML_FIELD]: this.state[HEADER_HTML_FIELD] || "",
                }
            });
        this.props.savePiece && this.props.savePiece(this.props.id);
        this.setEditorActive(false);
    }

    onClose() {
        this.props.node ? this.setEditorActive(false) : (this.props.onClose && this.props.onClose());
    }

    createEditor() {
        // this.props.node
        if (this.props.node) {
            this.props.node.addEventListener('click', this.onClickBound);
        }
    }

    destroyEditor() {
        if (this.props.node) {
            this.props.node.removeEventListener('click', this.onClickBound);
        }
    }

    renderNonReactAttributes() {
        if (this.props.editorActive && !this.state.sourceEditorActive) {
            this.createEditor();
            if (this.props.node) {
                this.props.node.classList.add(...this.props.className.split(' '));
            }
        }
        else {
            this.destroyEditor();
            if (this.props.node) {
                this.props.node.classList.remove(...this.props.className.split(' '));
            }
        }
    }

    /**
     * handle closed event from the modal component
     * @param event
     */
    handleCloseModal(event) {
        if (event.type == 'keydown' && event.keyCode === 27) {
            this.modalNode.parentNode.dispatchEvent(new KeyboardEvent('keyDown', {key: 'Escape'}));
        }
    }

    render() {
        let modalDiv = null;

        if (this.state.sourceEditorActive) {

            let options = {
                lineNumbers: true,
                mode: 'htmlmixed'
            };

            const {title, description, keywords} = this.state;
            const descr = description.length > 156 ? (description.substring(0, 153) + "...") : description;

            const descriptionIsLong = description.length > 156;
            const titleIsLong = title.length > 70;

            const floatRight = {
                float: "right",
                paddingRight: "131px"
            };
            const {id} = this.props;
            const html = html_beautify(this.state.html, this.beautifyOptions);

            modalDiv =
                <Modal contentLabel="Edit SEO Information" isOpen={true} overlayClassName="r_modal-overlay r_reset r_visible"
                       className="r_modal-content r_modal-content-seo"
                       ref={(modal) => this.modalNode = (modal && modal.node)}
                       onRequestClose={this.handleCloseModal.bind(this)}>
                    <div className="r_modal-title">
                        <div className="r_modal-close" onClick={this.onClose.bind(this)}>
                            <i className="rx_icon rx_icon-close">&nbsp;</i>
                        </div>
                        <span>{i18n.header}</span>
                    </div>
                    <div className="r_row">
                        <div className="r_col">

                            <div className="item-form">
                                <input id={`r_${id}_title`} placeholder={i18n.title} type="text" defaultValue={title}
                                       onChange={(event)=>this.updateValue(TITLE_FIELD, event.target.value)}/>
                                <span className={"number-badge " + (titleIsLong ? "warning" : "ok")}>{70 - title.length}</span>
                                <div className="description">Keep less than 70 characters</div>
                            </div>

                            <div className="item-form">
                                <textarea id={`r_${id}_description`} placeholder={i18n.description} type="text"
                                          defaultValue={description} rows="5"
                                          onChange={(event)=>this.updateValue(DESCRIPTION_FIELD, event.target.value)}/>
                                <span
                                    className={"number-badge " + ((description.length>160) ? "warning" : "ok")}>{160 - description.length}</span>
                                <div className="description">Keep less than 160 characters</div>
                            </div>

                            <div className="item-form">
                                <input id={`r_${id}_keywords`} placeholder={i18n.keywords} type="text"
                                       defaultValue={keywords}
                                       onChange={(event)=>this.updateValue(KEYWORDS_FIELD, event.target.value)}/>
                                {false && <span className="number-badge">{keywords.length}</span>}
                                <div className="description">Keep to 5 keywords or less</div>
                            </div>
                        </div>
                        <div className="r_col">
                            {false && <label htmlFor={`r_${id}_description`}>${i18n.meta}</label>}
                            <Codemirror
                                value={html}
                                onChange={this.updateCode.bind(this)} options={options}/>
                            <div className="codemirror-hint">{i18n.metaDescription}</div>
                        </div>
                    </div>

                    <div>
                        <div className="google-preview-wrapper">
                            <div className="google-preview">
                                <div className="google-header">{title}</div>
                                <div className="google-website">{window.location.href}</div>
                                <div className="google-description">{descr}</div>
                            </div>
                        </div>
                        <label>{i18n.google}</label>
                    </div>

                    <div className="r_modal-actions-bar">
                        {false && <div className="button button-cancel" onClick={this.onClose.bind(this)}>Cancel</div> }
                        <div className="button button-save"
                             onClick={()=>this.onSave()}>
                            {i18n.saveButton}
                        </div>
                    </div>
                </Modal>;
        } else {
            modalDiv = React.createElement(this.props.wrapper, {});
        }

        this.renderNonReactAttributes();
        return modalDiv;
    }
}


/**
 * Specify component should be rendered inside target node and capture all inside html
 * @type {string}
 */
RedaxtorSeo.__renderType = "BEFORE";
RedaxtorSeo.__editLabel = i18n.__floatingEditLabel;
RedaxtorSeo.__name = i18n.__checkboxName;
RedaxtorSeo.applyEditor = function(node, data){
    throw new Error("SEO editor data can't be applied to DOM node, update that data on server side");
};