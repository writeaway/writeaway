"use strict"
import React from "react"
import ReactDOM from "react-dom"
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'

import RedaxtorContainer from "./containers/RedaxtorContainer"
import connectPieceContainer, {initPiece} from "./containers/connectPieceContainer"
import reducers from "./reducers"
import {pieceGet, addPiece, updatePiece, addI18n} from './actions'

class Redaxtor {
    constructor(options) {
        const defaultState = {
            edit: false,
            highlight: true,
            currentSourcePieceId: null,
            pieces: {}
        }

        if (options.pieces) {
            this._edit = false;
            defaultState.pieces = {};
            this.pieces = {
                attribute: "data-piece",
                attributeId: "data-id",
                attributeGetURL: "data-get-url",
                attributeSaveURL: "data-save-url",
                attributeContentId: "data-content-id",
                components: {},
                initialState: {},
                //other options: getURL, saveURL
                ...options.pieces
            };
        }

        if (options.pages) {
            defaultState.pages = {};
            this.pages = options.pages;
        }

        if (options.i18n) {
            defaultState.i18n = {};
            this.i18n = options.i18n;
        }

        this.store = createStore(reducers, {...defaultState, ...options.state}, applyMiddleware(thunk))

        options.pieces && this.initPieces();
        options.pages && this.initPages();
        options.i18n && this.initI18N();

        this.showBar();
    }

    showBar() {
        this.barNode = document.createElement("DIV");
        ReactDOM.render(<Provider store={this.store}><RedaxtorContainer
            components={this.pieces.components}/></Provider>, this.barNode);
        document.body.appendChild(this.barNode);
    }

    initPieces() {
        const selector = this.pieces.attribute.indexOf("data-") === 0 ? "[" + this.pieces.attribute + "]" : this.pieces.attribute;
        var nodes = document.querySelectorAll(selector);

        for (var i = 0; i < nodes.length; ++i) {
            let el = nodes[i];
            this.store.dispatch(addPiece({
                node: el,
                type: el.getAttribute(this.pieces.attribute),
                id: el.getAttribute(this.pieces.attributeId),
                contentId: el.getAttribute(this.pieces.contentId) || false,
                getURL: el.getAttribute(this.pieces.attributeGetURL) || this.pieces.getURL,
                saveURL: el.getAttribute(this.pieces.attributeSaveURL) || this.pieces.saveURL
            }))
        }

        this.unsubscribe = this.store.subscribe(this.onStoreChange.bind(this))
        this.onStoreChange()
    }

    initPages() {

    }

    initI18N() {
        const ignoredTags = {
                script: true,
                style: true,
                html: true,
                head: true
            },
            ignoredAttributes = {
                id: true,
                style: true,
                class: true,
                getNamedItem: true,
                getNamedItemNS: true,
                setNamedItem: true,
                setNamedItemNS: true,
                removeNamedItem: true,
                removeNamedItemNS: true,
                'http-equiv': true,
                href: true,
                src: true,
                rel: true,
                target: true,
                charset: true
            },
            escapeHtmlEntities = text => {
                var entityTable = {
                    38 : 'amp',
                    60 : 'lt',
                    62 : 'gt'
                };
                return text.replace(/[<>&]/g, function(c) {
                    return '&' +
                        (entityTable[c.charCodeAt(0)] || '#'+c.charCodeAt(0)) + ';';
                });
            },
            findString = (node, string) => {
            //if (node.nodeType === 1 && node.dataset.component) return;
            switch (node.nodeType) {
                case 1:
                    if (ignoredTags[node.tagName.toLowerCase()]) break;
                    let dataAttr = void(0);
                    for (let index in node.attributes) {
                        if (!node.attributes[index].name || ignoredAttributes[node.attributes[index].name]) break;
                        if (node.attributes[index].value.indexOf(string) > -1) {
                            (typeof dataAttr !== 'object') && (dataAttr = {});
                            !dataAttr.node && (dataAttr.node = node);
                            !dataAttr.visible && (dataAttr.visible = !(node.tagName.toLowerCase() === 'meta'));
                            !dataAttr.attributes && (dataAttr.attributes = []);
                            dataAttr.attributes.push(node.attributes[index].name);
                        }
                    }
                    if (dataAttr) {
                        !result[string] && (result[string] = {});
                        !result[string].attributes && (result[string].attributes = []);
                        result[string].attributes.push(dataAttr);
                    }
                    break;
                case 3:
                    if (node.nodeValue.indexOf(string) > -1) {
                        let parent = node.parentElement,
                            isVisible = !(parent.tagName.toLowerCase() === "title");
                        isVisible && (parent.innerHTML = parent.innerHTML.replace(escapeHtmlEntities(string), '<span class="i18n">' + string + '</span>'));
                        !result[string] && (result[string] = {});
                        !result[string].nodes && (result[string].nodes = []);
                        result[string].nodes.push({
                            node: isVisible ? parent.querySelector('span.i18n') : parent,
                            visible: isVisible
                        });
                    }
                    break;
            }

            if (node.childNodes && node.childNodes.length) {
                for (let index in node.childNodes) {
                    findString(node.childNodes[index], string);
                }
            }
        };
        var result = {},
            array = [],
            activeLanguage = 'en';
        var i = 0;
        while (i < 1) {
            for (var key in this.i18n) {
                findString(document.documentElement, key);
            }
            i++
        }
        for (let id in result){
            this.store.dispatch(addI18n({
                nodes: result[id].nodes||null,
                attributes: result[id].attributes||null,
                id: id,
                translate: this.i18n[id]
            }))
        }
        debugger
    }

    onStoreChange() {
        let previousEdit = this._edit;
        let state = this.store.getState();
        this._edit = state.edit
        if (previousEdit !== this._edit) {
            if (this._edit) {
                Object.keys(state.pieces).forEach(id => {
                    const piece = state.pieces[id]
                    if (!this.pieces.components[piece.type]) {
                        console.log("Not found component type", piece.type);
                        return;
                    }

                    if (this.pieces.initialState && this.pieces.initialState[piece.id]) {
                        this.pieces.initialState[piece.id].id = id;
                        this.store.dispatch(updatePiece(piece.id, this.pieces.initialState[piece.id]));
                        initPiece(this.store, this.pieces.components[piece.type], this.store.getState().pieces[piece.id]);
                    } else {
                        this.store.dispatch(pieceGet(piece.id)).then(() => {
                                const pieceState = this.store.getState().pieces[piece.id];
                                if (pieceState.fetched) {
                                    initPiece(this.store, this.pieces.components[piece.type], pieceState)
                                }
                            }
                        )
                    }

                });
            } else {
                //todo it deletes HTML
                // Object.keys(state.pieces).forEach(id => {
                //     const piece = state.pieces[id]
                //     ReactDOM.unmountComponentAtNode(piece.node);
                // });
            }
        }
    }
}

export default Redaxtor