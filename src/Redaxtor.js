"use strict";
import React from "react"
import ReactDOM from "react-dom"
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'

import RedaxtorContainer from "./containers/RedaxtorContainer"
import connectPieceContainer from "./containers/connectPieceContainer"
import reducers from "./reducers"
import {addPiece, updatePiece} from './actions'

class Redaxtor {
    constructor(options) {
        const defaultState = {
            edit: false,
            highlight: true,
            pieces: {}
        }

        if (options.pieces) {
            this._edit = false;
            defaultState.pieces = {};
            this.pieces = {
                attribute: "data-piece",
                attributeId: "data-id",
                attributeFetchURL: "data-fetch-url",
                attributeSaveURL: "data-save-url",
                components: {},
                initialState: {},
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
        ReactDOM.render(<Provider store={this.store}><RedaxtorContainer/></Provider>, this.barNode);
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
                fetchURL: el.getAttribute(this.pieces.attributeFetchURL),
                saveURL: el.getAttribute(this.pieces.attributeSaveURL)
            }))
        }

        this.unsubscribe = this.store.subscribe(this.onStoreChange.bind(this))
        this.onStoreChange()
    }

    initPages() {

    }

    initI18N() {

    }

    onStoreChange() {
        let previousEdit = this._edit;
        let state = this.store.getState();
        this._edit = state.edit
        if (previousEdit !== undefined && previousEdit !== this._edit) {
            if (this._edit) {
                Object.keys(state.pieces).forEach(id => {
                    const piece = state.pieces[id]
                    if (!this.pieces.components[piece.type]) {
                        console.log("Not found component type", piece.type);
                        return;
                    }

                    if (this.pieces.initialState[piece.id]) {
                        this.pieces.initialState[piece.id].id = id;
                        this.store.dispatch(updatePiece(piece.id, this.pieces.initialState[piece.id]))
                    } else {
                        //todo AJAX will be here? or in actions
                    }

                    piece.node.style.width = "100%";
                    piece.node.style.height = "100%";
                    let Component = connectPieceContainer(this.pieces.components[piece.type], id)

                    ReactDOM.render(
                        <Provider store={this.store}>
                            <Component id={piece.id} type={piece.type} node={piece.node}/>
                        </Provider>, piece.node);

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