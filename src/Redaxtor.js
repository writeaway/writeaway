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

/**
 * Default minimum api allows basic editing without saving anything
 * No Uploads and gallery
 * TODO: Note this implementation is dependent on submodules. Reimplement as multi-extendable
 */
const defaultMinimumApi = {
    getImageList: false,
    uploadImage: false,
    getPieceData: function (piece) {
        console.warn("Using default implementation for getting piece data. This should be overriden", piece);
        if (piece.type == "source" || piece.type == "html") {
            return Promise.resolve({
                ...piece,
                data: {
                    html: piece.node.innerHTML
                }
            });
        }
        if (piece.type == "image") {
            return Promise.resolve({
                ...piece,
                data: {
                    src: piece.node.src,
                    alt: piece.node.alt,
                }
            });
        }
        if (piece.type == "background") {
            return Promise.resolve({
                ...piece,
                data: {
                    url: piece.node.style.backgroundImage && piece.node.style.backgroundImage.slice(4, -1).replace(/"/g, ""),
                    bgColor: piece.node.style.backgroundColor,
                    bgRepeat: piece.node.style.backgroundRepeat,
                    bgSize: piece.node.style.backgroundSize,
                    bgPosition: piece.node.style.backgroundPosition,
                    alt: piece.node.title || ""
                }
            });
        }
        return Promise.reject()
    },
    savePieceData: function (piece) {
        console.warn("Using default implementation for saving piece data. This should be overriden", piece);
        return Promise.resolve();
    }
};

class Redaxtor {
    constructor(options) {
        /**
         * External server API
         */
        this.api = void 0;
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


        const defaultState = {};

        /**
         * Init API. Api is a const, we don't put it in storage, putting in const config instead
         */
        this.api = config.api = {...defaultMinimumApi, ...options.api};

        if (options.pieces) {
            options.pieces.components = {...options.pieces.components};

            this.pieces = {
                attribute: "data-piece",
                attributeId: "data-id",
                attributeName: "data-name",
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
                editorActive: false,
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
                        className="r_toast-container"
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
                name: el.getAttribute(this.pieces.attributeName),
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
