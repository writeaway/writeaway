import { IPieceProps } from '@writeaway/core';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import _MediumEditor from './HTMLEditor';
import i18n from './i18n';
import {imageManagerApi} from './imageManager/index';

export default class RedaxtorMedium extends Component<IPieceProps>  {
    constructor(props) {
        super(props);
        this.state = {codeEditorActive: false};
    }

    componentDidMount() {
        imageManagerApi.init({
            api: this.props.api,
            container: ReactDOM.findDOMNode(this),
            id: this.props.id
        });
        const nodeRect = this.props.api.getNodeRect(this.props);
        this.rect = nodeRect.hover || nodeRect.node;
    };

    saveSelection() {
        this.savedRange = window.getSelection().getRangeAt(0);
    }

    restoreSelection() {
        if (this.savedRange !== null) {
            var s = window.getSelection();
            s.removeAllRanges();
            s.addRange(this.savedRange);
        }
    }

    onToggleImagePopup() {
        let imageData = {};
        console.trace("Having image?", this.img);
        if (this.img) {
            imageData = {
                src: this.img.getAttribute("src"),
                alt: this.img.getAttribute("alt"),
                title: this.img.getAttribute("title"),
                width: this.img.width,
                height: this.img.height,
            };
        }

        imageManagerApi.get().setImageData({
            url: imageData.src,
            alt: imageData.alt || "",
            title: imageData.title || "",
            width: +imageData.width,
            height: +imageData.height,
            pieceRef: {
                type: this.props.type,
                data: this.props.data,
                id: this.props.id,
                dataset: this.props.dataset
            },
            onClose: this.cancelCallback.bind(this),
            onSave: this.saveCallback.bind(this),
            settings: {
                editDimensions: true,
                editBackground: false
            }
        });

        this.medium.editor.saveSelection();
        imageManagerApi.get().showPopup();
    }

    saveCallback(data) {
        this.medium.editor.restoreSelection();

        if (this.img) {
            this.img.src = data.url;
            this.img.alt = data.alt;
            this.img.title = data.title;
            if (!this.img.style) {
                this.img.style = {};
            }
            this.img.style.width = data.width + "px";
            this.img.style.height = data.height + "px";
            this.img = null;
        } else {
            var html = [`src="${data.url}"`];
            if (data.width && data.height) {
                html.push(`style="width: ${data.width}px; height: ${data.height}px"`)
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
        this.props.updatePiece(this.props.id, {data: {html: this.medium.editor.getContent()}})
    }

    cancelCallback() {
        this.medium.editor.restoreSelection();
    }


    /**
     * Handle clicking on image in html
     * @param e
     */
    onClick(e) {
        console.trace("Prevent click 2", e);
        e.preventDefault();
        e.stopPropagation();

        if (e.target.tagName.toLowerCase() !== 'img') {
            this.img = null;
        } else {
            this.img = e.target;
            console.trace("Found Image");
        }
        if (e.target.tagName.toLowerCase() !== 'img') return;
        var sel = window.getSelection();
        var range = document.createRange();
        range.selectNode(e.target);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    createEditor() {
        const dom = this.props.node;
        this.editorData = null;
        // const dom = ReactDOM.findDOMNode(this);
        this.medium = new _MediumEditor(dom, {
            onUpdate: () => {
                this.checkifResized();
                this.props.updatePiece(this.props.id, {data: {html: this.medium ? this.medium.getEditorContent() : this.editorData}})
            },
            onNeedResizeCheck: () => {
                this.checkifResized();
            },
            onSave: () => {
                this.props.savePiece(this.props.id)
            },
            onLeave: (resetCallback) => {
                /* if(resetCallback) {
                 if(confirm("Save changes?")) {
                 this.props.savePiece(this.props.id);
                 } else {
                 resetCallback();
                 this.props.resetPiece(this.props.id);
                 }
                 } else {
                 //
                 }*/
                this.props.savePiece(this.props.id);
            },
            __getBoundingRect: () => {
                const nodeRect = this.props.api.getNodeRect(this.props);
                return nodeRect.hover || nodeRect.node;
            },
            onSetCurrentSourcePieceId: () => {
                this.props.setCurrentSourcePieceId(this.props.id)
            },
            onToggleImagePopup: this.onToggleImagePopup.bind(this),
            pickerColors: this.props.options.pickerColors,
            i18n: i18n.medium,
            onEditorActive: (active) => {
                this.props.onEditorActive && this.props.onEditorActive(this.props.id, active);
            }
        });
        this.props.node.addEventListener('click', this.onClickBound);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.editorActive !== this.props.editorActive) {
            return true;
        }
        if (nextProps.expert !== this.props.expert) {
            return true;
        }
        return nextProps.data.html !== this.props.data.html;
    }

    destroyEditor() {
        if (this.medium) {
            this.editorData = this.medium.getEditorContent();
            this.medium.destroy();
            this.props.node.removeEventListener('click', this.onClickBound);
            delete this.medium;
        }
    };

    /**
     * Updates rendering of props that are not updated by react
     * Here that updates styles of background
     */
    renderNonReactAttributes(data) {
        // console.log('Re-Rendered?', this.props.id);
        if (this.props.editorActive) {
            if (!this.medium) {
                this.createEditor();
                this.props.node.classList.add(...this.props.className.split(' '));
            }
        } else {
            this.props.node.classList.remove(...this.props.className.split(' '));

            // the destroyEditor method called also from  the shouldComponentUpdate method and this. medium can not exist here
            if (this.medium) {
                this.destroyEditor();
            }
        }

        this.nodeWasUpdated = false;
        if (this.medium) {
            let content = this.medium.getEditorContent();
            if (content != data.html) {
                // console.log('Re-Rendered HARD', this.props.id);
                this.medium.editor.setContent(data.html);
                this.nodeWasUpdated = true;
            }

            const toolbar = this.medium.editor.getExtensionByName('toolbar');
            if(this.props.expert) {
                toolbar.toolbar.classList.remove("rx_non-expert");
            } else {
                toolbar.toolbar.classList.add("rx_non-expert");
            }
        } else {
            this.nodeWasUpdated = RedaxtorMedium.applyEditor(this.props.node, data);
        }

    }

    componentWillUnmount() {
        this.destroyEditor();
        console.log(`Medium editor ${this.props.id} unmounted`);
    }

    componentDidUpdate() {
        this.checkifResized();
    }

    checkifResized() {
        const nodeRect = this.props.api.getNodeRect(this.props);
        const rect = nodeRect.hover || nodeRect.node;
        if (this.changedBoundingRect(rect)) {
            this.setBoundingRect(rect);
            this.props.onNodeResized && this.props.onNodeResized(this.props.id);
        }
    }

    /**
     * Check if node size is different
     * @param rect {ClientRect}
     */
    changedBoundingRect(rect) {
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
    setBoundingRect(rect) {
        this.rect = rect;
    }

    render() {
        this.renderNonReactAttributes(this.props.data);
        return React.createElement(this.props.wrapper, {});
    }
}

/**
 * Specify component should be rendered inside target node and capture all inside html
 * @type {string}
 */
RedaxtorMedium.__renderType = "BEFORE";
RedaxtorMedium.__editLabel = i18n.richText.__floatingEditLabel;
RedaxtorMedium.__name = i18n.richText.__checkboxName;
RedaxtorMedium.applyEditor = function (node, data) {
    if (node) {

        let content = node.innerHTML;
        if (content != data.html) {
            node.innerHTML = data.html;
            return true;
        }
    }

    return false;
};
