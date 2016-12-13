"use strict";
import React from "react";
import ReactDOM from "react-dom";
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import ReduxToastr from 'react-redux-toastr'

import {setStore} from './store';
import {setConfig, getConfig} from './config';//TODO: Unused, remove

import RedaxtorContainer from "./containers/RedaxtorContainer";
// import Img from "./components/img/ImgContainer";

import reducers from "./reducers";
import {initI18N} from './actions/i18n';
import {pieceGet, addPiece, updatePiece} from './actions/pieces';
import {pagesGet, pagesGetLayouts} from './actions/pages';
import {configureFetch} from './helpers/callFetch'

let config = getConfig();

class Redaxtor {
    constructor(options) {
        /**
         * Editable DOM pieces editors
         */
        this.pieces = void 0;

        /**
         * Editable pages editors
         */
        this.pages = void 0;

        /**
         * Internalization editors
         */
        this.i18n = void 0;

        options.images && (config.images = options.images);
        const defaultState = {};

        if (options.pieces) {
            options.pieces.components = {
                // img: Img,
                ...options.pieces.components
            };

            this._edit = false;//TODO: No other code mentions. Unused?
            this.pieces = {
                attribute: "data-piece",
                attributeId: "data-id",
                attributeUseHTML: "data-use-html",
                attributeGetURL: "data-get-url",
                attributeSaveURL: "data-save-url",
                components: {},
                initialState: {},
                //other options: getURL, saveURL
                ...options.pieces
            };

            config.pieces = {
                components: options.pieces.components
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

    /**
     * Renders a top Redaxtor bar with controls and attach it to body
     */
    showBar() {
        this.barNode = document.createElement("DIV");
        ReactDOM.render(
            <Provider store={this.store}>
                <div>
                    <RedaxtorContainer
                        components={this.pieces.components}
                        tabs={{
                        pieces: !!this.pieces,
                        i18n: !!this.i18n,
                        pages: !!this.pages
                    }}>
                    </RedaxtorContainer>
                    <ReduxToastr
                        timeOut={4000}
                        position="top-right"/>
                </div>
            </Provider>,
            this.barNode
        );
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
                useHTML: el.getAttribute(this.pieces.attributeUseHTML) || this.pieces.useHTML,
                getURL: el.getAttribute(this.pieces.attributeGetURL) || this.pieces.getURL,
                saveURL: el.getAttribute(this.pieces.attributeSaveURL) || this.pieces.saveURL,
                dataset: {},
                changed: false
            };

            for (let data in el.dataset) {//can we use rest on DOMStringMap? pieceObj.dataset = {...el.dataset}
                pieceObj.dataset[data] = el.dataset[data]
            }

            this.store.dispatch(addPiece(pieceObj))
        }
    }

    initPages() {
        this.store.dispatch(pagesGet());
        this.pages.getLayoutsURL && this.store.dispatch(pagesGetLayouts());
    }

    initI18N() {
        this.store.dispatch(initI18N());
    }
}

export default Redaxtor
