import { boundMethod } from 'autobind-decorator';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import type { IPieceProps, Rect } from '@writeaway/core';
import { RedaxtorImageTagData } from 'types';
import {imageManagerApi} from './imageManager/index';


export default class RedaxtorImageTag extends Component<IPieceProps> {
    /**
     * Specify component should have a separate node and is not modifying insides or outsides of target node
     * @type {string}
     */
    static readonly __renderType: string = "BEFORE";
    static readonly editLabel: string = "Click to Edit Image";
    static readonly label: string = "Images";
    static readonly applyEditor = (node: HTMLImageElement, data: RedaxtorImageTagData) => {
        if (!node) {return;}
        node.src = data.src || '';
        node.alt = data.alt || '';
        node.setAttribute("title", data.title || '');
    }
    private active: boolean; // TODO: Refactor to store in state?
    private rect: Rect; // TODO: Refactor to store in state?

    constructor(props: IPieceProps) {
        super(props);

        if (this.props.node.nodeName !== "IMG") {
            throw new Error("Image editor should be set on image");
        }

        this.state = {firstRun: true};
        this.active = false;//TODO: Think how to do that more "react" way. This flag allows to handle events bound to PARENT node. Ideally we should not have parent node at all.
    }

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


    componentWillReceiveProps(newProps: IPieceProps) {
        if (newProps.manualActivation) { // TODO: what is this crazyness
            this.props.onManualActivation(this.props.id);
            this.activateEditor();
        }
        if (newProps.manualDeactivation) { // TODO: what is this crazyness
            this.props.onManualDeactivation(this.props.id);
            this.deactivateEditor();
        }
    }

    componentDidMount() {
        imageManagerApi.init({
            api: this.props.api,
            container: ReactDOM.findDOMNode(this),
            id: this.props.id
        });
        this.check();
        const nodeRect = this.props.api.getNodeRect(this.props);
        this.rect = nodeRect.hover || nodeRect.node;
    };


    onToggleImagePopup() {
        imageManagerApi.get().setImageData({
            data: {
                src: this.props.node.src,
                alt: this.props.node.alt || "",
                title: this.props.node.getAttribute("title") || "",
                width: this.props.node.width,
                height: this.props.node.height,
            },
            pieceRef: {
                type: this.props.type,
                data: this.props.data,
                id: this.props.id,
                dataset: this.props.dataset
            },
            onClose: this.cancelCallback,
            onSave: this.saveCallback,
            settings: {
                editDimensions: false,
                editBackground: false
            }
        });
        imageManagerApi.get().showPopup();
        this.props.onEditorActive && this.props.onEditorActive(this.props.id, true);
    }

    closePopup() {
        imageManagerApi.get().onClose();
    }

    @boundMethod
    saveCallback(data: RedaxtorImageTagData) {
        this.props.updatePiece(this.props.id, {data: {src: data.src, alt: data.alt, title: data.title}});
        this.props.savePiece(this.props.id);
        this.props.onEditorActive && this.props.onEditorActive(this.props.id, false);
    }

    @boundMethod
    cancelCallback() {
        this.props.onEditorActive && this.props.onEditorActive(this.props.id, false);
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
        if (!this.active && this.props.node) {
            this.props.node.addEventListener("click", this.onClick);
            this.props.node.classList.add("r_editor");
            this.props.node.classList.add("r_edit");
            this.active = true;
        }
    }

    shouldComponentUpdate(nextProps: IPieceProps & {data: RedaxtorImageTagData}, nextState: IPieceProps & {data: RedaxtorImageTagData}) {
        return (nextProps.data.src !== this.props.node.src
        || nextProps.data.alt !== this.props.node.alt
        || nextProps.data.title !== this.props.node.title
        || nextProps.editorActive !== this.props.editorActive);
    }

    /**
     * Ensures editor is disabled
     */
    die() {
        if (this.active && this.props.node) {
            this.props.node.removeEventListener("click", this.onClick);
            this.props.node.classList.remove("r_editor");
            this.props.node.classList.remove("r_edit");
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
     * Here that updates IMG tag src and alt
     */
    renderNonReactAttributes(data: RedaxtorImageTagData) {
        RedaxtorImageTag.applyEditor(this.props.node, data);
    }

    componentWillUnmount() {
        this.die();
        console.log(`Image editor ${this.props.id} unmounted`);
    }

    render() {
        this.check();
        this.renderNonReactAttributes(this.props.data);
        return React.createElement(this.props.wrapper, {})
    }

    componentDidUpdate() {
        this.checkifResized();
    }

    checkifResized() {
        const nodeRect = this.props.api.getNodeRect(this.props);
        const rect = nodeRect.hover || nodeRect.node;
        if (false && this.changedBoundingRect(rect)) { // TODO was checking 'this.nodeWasUpdated' here that is never changed anywhere
            this.setBoundingRect(rect);
            this.props.onNodeResized && this.props.onNodeResized(this.props.id); // TODO: onNodeResized is never used anywhere
        }
    }

    /**
     * Check if node size is different
     * @param rect {ClientRect}
     */
    changedBoundingRect(rect: Rect) {
        return !this.rect ||
            this.rect.top !== rect.top ||
            this.rect.left !== rect.left ||
            this.rect.bottom !== rect.bottom ||
            this.rect.right !== rect.right;
    }

    /**
     * Store node size
     * @param rect {ClientRect}
     */
    setBoundingRect(rect: Rect) {
        this.rect = rect;
    }
};
