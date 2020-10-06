import { IPieceProps } from '@writeaway/core';
import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { RedaxtorImageData } from 'types';
import {imageManagerApi} from './imageManager/index';

export default class RedaxtorBackgroundEditor extends Component<IPieceProps> {
    /**
     * Specify component should have a separate node and is not modifying insides or outsides of target node
     * @type {string}
     */
    static readonly __renderType = "BEFORE";
    static readonly editLabel = "Click to Edit the Background";
    static readonly label = "Backgrounds";
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

    constructor(props) {
        super(props);
        this.state = {firstRun: true};
        this.active = false;//TODO: Think how to do that more "react" way. This flag allows to handle events bound to PARENT node. Ideally we should not have parent node at all.
        this.targetDiv = props.node;
    }

    componentDidMount() {
        imageManagerApi.init({
            api: this.props.api,
            container: ReactDOM.findDOMNode(this),
            id: this.props.id
        });
        this.check();
    };

    /**
     * That is a common public method that should activate component editor if it presents
     */
    activateEditor() {
        if (this.props.editorActive && !imageManagerApi.get().state.isVisible) {
            this.onToggleImagePopup();
        }
    }

    deactivateEditor() {
        if (this.props.editorActive && imageManagerApi.get().state.isVisible) {
            this.closePopup();
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.manualActivation) {
            this.props.onManualActivation(this.props.id);
            this.activateEditor();
        }
        if (newProps.manualDeactivation) {
            this.props.onManualDeactivation(this.props.id);
            this.deactivateEditor();
        }
    }

    onToggleImagePopup() {
        const computedStyle = getComputedStyle(this.targetDiv);
        imageManagerApi.get().setImageData({
            data: {
                src: computedStyle.backgroundImage && computedStyle.backgroundImage.slice(4, -1).replace(/"/g, ""),
                bgColor: computedStyle.backgroundColor,
                bgRepeat: computedStyle.backgroundRepeat,
                bgSize: computedStyle.backgroundSize,
                bgPosition: computedStyle.backgroundPosition,
                title: this.targetDiv.getAttribute("title") || "",
            },
            pieceRef: {
                type: this.props.type,
                data: this.props.data,
                id: this.props.id,
                dataset: this.props.dataset
            },
            onClose: this.cancelCallback.bind(this),
            onSave: this.saveCallback.bind(this),
            settings: {
                editDimensions: false,
                editBackground: true
            }
        });
        imageManagerApi.get().showPopup();
        this.props.onEditorActive && this.props.onEditorActive(this.props.id, true);
    }

    closePopup() {
        imageManagerApi.get().onClose();
    }

    saveCallback(data) {
        this.renderNonReactAttributes(data);
        this.props.updatePiece(this.props.id, {
            data: {
                src: data.src,
                title: data.title,
                bgSize: data.bgSize,
                bgRepeat: data.bgRepeat,
                bgPosition: data.bgPosition,
                bgColor: data.bgColor
            }
        });
        this.props.savePiece(this.props.id);
        this.props.onEditorActive && this.props.onEditorActive(this.props.id, false);
    }

    cancelCallback() {
        this.props.onEditorActive && this.props.onEditorActive(this.props.id, false);
    }

    findRedaxtor(el) {
        while (el && el.tagName.toLowerCase() != 'redaxtor' && (!el.className || (el.className.indexOf("r_modal-overlay") == -1 && el.className.indexOf("r_bar") == -1))) {
            el = el.parentElement;
        }
        return el;
    }

    onClick(e) {
        if (this.findRedaxtor(e.target)) {
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
            this.targetDiv.addEventListener("click", this.onClickBind);
            this.targetDiv.classList.add("r_editor");
            this.targetDiv.classList.add("r_edit");
            this.active = true;
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.data.url !== this.targetDiv.url
        || nextProps.data.bgColor !== this.targetDiv.bgColor
        || nextProps.data.bgSize !== this.targetDiv.bgSize
        || nextProps.data.bgRepeat !== this.targetDiv.bgRepeat
        || nextProps.data.bgPosition !== this.targetDiv.bgPosition
        || nextState.editorActive !== this.props.editorActive);
    }

    /**
     * Ensures editor is disabled
     */
    die() {
        if (this.active && this.targetDiv) {
            this.targetDiv.removeEventListener("click", this.onClickBind);
            this.targetDiv.classList.remove("r_editor");
            this.targetDiv.classList.remove("r_edit");
            this.active = false;
        }
    };

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
    renderNonReactAttributes(data) {
        RedaxtorBackgroundEditor.applyEditor(this.targetDiv, data);
    }

    componentWillUnmount() {
        this.die();
        console.log(`Background editor ${this.props.id} unmounted`);
    }

    render() {
        this.check();
        this.renderNonReactAttributes(this.props.data);
        return React.createElement(this.props.wrapper, {})
    }
}
