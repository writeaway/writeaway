"use strict";
import React from "react";
import ReactDOM from "react-dom";
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import ReduxToastr from 'react-redux-toastr'

import {setStore} from './store';
import {setConfig, getConfig} from './config';

import { compose } from 'redux';

import RedaxtorContainer from "./containers/RedaxtorContainer";
// import Img from "./components/img/ImgContainer";

import reducers from "./reducers";
import {initI18N} from './actions/i18n';
import {addPiece, removePiece, pieceUnmount} from './actions/pieces';
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
         * @deprecated
         */
        this.pages = void 0;

        /**
         * Internalization editors
         * @deprecated
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

            defaultState.pieces = {

            };

            Object.keys(options.pieces.components).forEach((key)=>{
                this.pieces[`editorEnabled:${key}`] = true;
                defaultState.pieces[`editorEnabled:${key}`] = true;
            });
        }

        //@deprecated
        if (options.pages) {
            this.pages = {
                allowCreate: true,
                ...options.pages
            };
            defaultState.pages = this.pages;
        }

        //@deprecated
        if (options.i18n) {
            this.i18n = {
                editorActive: false,
                ...options.i18n
            };
            defaultState.i18n = this.i18n;
        }


        const composeEnhancers =
            //process.env.NODE_ENV !== 'production' && //TODO: Disallow in production
            typeof window === 'object' &&
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
                window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
                    name: "RedaXtor"
                }) : compose;

        this.store = createStore(reducers,
            {...defaultState, ...options.state},
            composeEnhancers(
                applyMiddleware(thunk)
                // other store enhancers if any
            ));

        setStore(this.store);
        if (options.ajax) configureFetch(options.ajax);

        options.pieces && this.initPieces(document);

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

    initPieces(contextNode) {
        const selector = this.pieces.attribute.indexOf("data-") === 0 ? "[" + this.pieces.attribute + "]" : this.pieces.attribute;
        let nodes = contextNode.querySelectorAll(selector);

        for (let i = 0; i < nodes.length; ++i) {
            let el = nodes[i];
            this.addPiece(el);
        }
    }

    /**
     * Add a piece from specific node
     * @param node HTMLElement
     * @param options
     * @param options.id {string} Mandatory unique identification id of piece. Should present in options OR in `this.pieces.attributeId` attribute of node, i.e. `data-id`
     * @param options.type {string} Mandatory type of piece. Should present in options OR in `this.pieces.attribute` attribute of node, i.e. `data-piece`
     * @param options.name {string} Optional human readable name for list in editor. If not specified will be tried to be read from `this.pieces.attributeName` attribute of node
     * @param options.dataset {Object} Optional set of data associated with node that will be passed to save and get API calls. If not specified will be read directly from node dataset
     */
    addPiece(node, options) {
        let piece = {
            node: node,
            type: (options && options.type) || node.getAttribute(this.pieces.attribute),
            id: (options && options.id) || node.getAttribute(this.pieces.attributeId),
            name: (options && options.name) || node.getAttribute(this.pieces.attributeName),
            dataset: (options && options.dataset) || {},
            changed: false
        };
        if(!options || !options.dataset) {
            for (let data in node.dataset) {
                piece.dataset[data] = node.dataset[data];
            }
        }
        if(!piece.id) throw new Error(`Can't add piece with undefined id`);
        if(!piece.type) throw new Error(`Can't add piece with undefined type`);
        if(!this.pieces.components[piece.type]) throw new Error(`Can't add piece with unsupported type "${piece.type}"`);

        this.store.dispatch(addPiece(piece))
    }

    /**
     * Prepares node for removal from DOM. Dirty destroys editor. Removes listeners, cleans up memory, but does not restore node fully.
     * @param id of element to destroy
     */
    destroyPiece(id) {
        this.store.dispatch(removePiece(id));//TODO: Might be deprecated
        this.store.dispatch(pieceUnmount(this.store.getState().pieces.byId[id]));//Remove element from dom and trigger removing from state
    }

    /**
     * @deprecated
     */
    initPages() {
        this.store.dispatch(pagesGet());
        this.pages.getLayoutsURL && this.store.dispatch(pagesGetLayouts());
    }

    /**
     * @deprecated
     */
    initI18N() {
        this.store.dispatch(initI18N());
    }
}

export default Redaxtor
