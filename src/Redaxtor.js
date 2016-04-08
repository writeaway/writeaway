"use strict";
import React from "react";
import ReactDOM from "react-dom";
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';

import {setStore} from './store';

import RedaxtorContainer from "./containers/RedaxtorContainer";
// import Img from "./components/img/ImgContainer";

import {initPiece} from "./containers/connectPieceContainer";
import reducers from "./reducers";
import {initI18N} from './actions/i18n';
import {pieceGet, addPiece, updatePiece} from './actions/pieces';
import {pagesGet, pagesGetLayouts} from './actions/pages';
import {configureFetch} from './helpers/fetch'

class Redaxtor {
    constructor(options) {
        const defaultState = {
            edit: false,
            highlight: true,
            currentSourcePieceId: null,
            pieces: {}
        };

        if (options.pieces) {
            options.pieces.components = {
                // img: Img,
                ...options.pieces.components
            };

            this._edit = false;
            defaultState.pieces = {};
            this.pieces = {
                attribute: "data-piece",
                attributeId: "data-id",
                attributeGetURL: "data-get-url",
                attributeSaveURL: "data-save-url",
                components: {},
                initialState: {},
                //other options: getURL, saveURL
                ...options.pieces
            };
        }

        if (options.pages) {
            this.pages = {
                allowCreate: true,
                ...options.pages
            };
            defaultState.pages = this.pages;
        }

        if (options.i18n) {
            this.i18n = {
                edit: false,
                ...options.i18n
            };
            defaultState.i18n = this.i18n;
        }

        this.store = createStore(reducers,
            {...defaultState, ...options.state},
            applyMiddleware(thunk));

        setStore(this.store);
        if (options.ajax) configureFetch(options.ajax);

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
        let nodes = document.querySelectorAll(selector);

        for (let i = 0; i < nodes.length; ++i) {
            let el = nodes[i];
            let pieceObj = {
                node: el,
                type: el.getAttribute(this.pieces.attribute),
                id: el.getAttribute(this.pieces.attributeId),
                getURL: el.getAttribute(this.pieces.attributeGetURL) || this.pieces.getURL,
                saveURL: el.getAttribute(this.pieces.attributeSaveURL) || this.pieces.saveURL,
                dataset: {}
            };

            for (let data in el.dataset) {//can we use rest on DOMStringMap? pieceObj.dataset = {...el.dataset}
                pieceObj.dataset[data] = el.dataset[data]
            }

            this.store.dispatch(addPiece(pieceObj))
        }

        this.unsubscribe = this.store.subscribe(this.onStoreChange.bind(this));
        this.onStoreChange()
    }

    initPages() {
        this.store.dispatch(pagesGet());
        this.pages.getLayoutsURL && this.store.dispatch(pagesGetLayouts());
    }

    initI18N() {
        this.store.dispatch(initI18N());
    }

    onStoreChange() {
        let previousEdit = this._edit;
        let state = this.store.getState();
        this._edit = state.edit;
        if (previousEdit !== this._edit) {
            if (this._edit) {
                Object.keys(state.pieces).forEach(id => {
                    const piece = state.pieces[id];
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
