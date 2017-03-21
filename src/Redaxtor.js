"use strict";
import React from "react";
import ReactDOM from "react-dom";
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import ReduxToastr from 'react-redux-toastr'

import {setStore} from './store';
import {setConfig, getConfig} from './config';

import {compose} from 'redux';

import RedaxtorContainer from "./containers/RedaxtorContainer";


import reducers from "./reducers";
import {initI18N} from './actions/i18n';
import {piecesToggleNavBar} from './actions/index';
import {addPiece, hoverPiece, removePiece, pieceUnmount, setPieceData, piecesToggleEdit, pieceGet, deactivatePiece} from './actions/pieces';
import {pagesGet, pagesGetLayouts} from './actions/pages';
import {configureFetch} from './helpers/callFetch'
import HoverOverlay from './containers/HoverOverlayContainer';

let config = getConfig();


/**
 * Calculate node bounding rect and it's capture area (that is recommended to be with small padding to node rect)
 * If "hover" area not returned, only "node" area is used and it is assumed node fit is too tight to enable paddings
 * @param piece {RedaxtorPiece}
 * @param padding {number} padding to add. Optional. Defaults to 10.
 * @param piece.node {HTMLElement}
 * @param piece.type {string}
 * @returns {{hover: {ClientRect}, node: {ClientRect}}}
 */
export const getNodeRect = function(piece, padding) {
    const _padding = typeof (padding) === 'undefined' ? 10 : +padding;

    let node = piece.node.getBoundingClientRect();

    let hover = {
        left: node.left - _padding,
        right: node.right + _padding,
        top: node.top - _padding,
        bottom: node.bottom + _padding,
        width: node.width + _padding*2,
        height: node.height + _padding*2,
    };

    if (hover.left + window.scrollX < 0 || hover.top + window.scrollY < 0 || hover.width + hover.left + window.scrollX > document.body.scrollWidth || hover.height + hover.top + window.scrollY > document.body.scrollHeight) {
        return {
            node
        }
    } else {
        return {
            node,
            hover
        }
    }
};

/**
 * Default minimum api allows basic editing without saving anything
 * No Uploads and gallery
 * TODO: Note this implementation is dependent on submodules. Reimplement as multi-extendable
 */
export const defaultMinimumApi = {
    getImageList: false,
    uploadImage: false,
    getNodeRect: getNodeRect,
    getPieceData: function (piece) {
        if (piece.type == "source" || piece.type == "html") {
            return Promise.resolve({
                ...piece,
                data: {
                    html: piece.node.innerHTML,
                    updateNode: true
                }
            });
        }
        if (piece.type == "image") {
            return Promise.resolve({
                ...piece,
                data: {
                    src: piece.node.src,
                    alt: piece.node.alt,
                    title: piece.node.title,
                }
            });
        }
        if (piece.type == "background") {
            const computedStyle = getComputedStyle(piece.node);
            return Promise.resolve({
                ...piece,
                data: {
                    url: computedStyle.backgroundImage && computedStyle.backgroundImage.slice(4, -1).replace(/"/g, ""),
                    bgColor: computedStyle.backgroundColor,
                    bgRepeat: computedStyle.backgroundRepeat,
                    bgSize: computedStyle.backgroundSize,
                    bgPosition: computedStyle.backgroundPosition,
                    title: piece.node.title || ""
                }
            });
        }
        if (piece.data) {
            // Piece already has data, ok
            return Promise.resolve(piece);
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
         * @type {RedaxtorAPI}
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


        const defaultState = {
            global: {
                navBarCollapsed: true
            }
        };

        /**
         * Init API. Api is a const, we don't put it in storage, putting in const config instead
         */
        this.api = config.api = {...defaultMinimumApi, ...options.api};

        /**
         * Init Options per component type. We don't put it in storage, putting in const config instead
         */
        this.options = config.options = options.options || {};

        if (options.pieces) {
            options.pieces.components = {...options.pieces.components};

            this.pieces = {
                attribute: "data-piece",
                attributeId: "data-id",
                attributeName: "data-name",
                components: {},
                initialState: {},
                ...options.pieces
            };

            config.pieces = {
                components: options.pieces.components
            };

            defaultState.pieces = {};

            Object.keys(options.pieces.components).forEach((key)=> {
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

        /**
         * options.piecesRoot - say where search for pieces
         */
        options.pieces && this.initPieces(options.piecesRoot || document);


        /**
         * default options for navbar
         */
        let barOptions = {
            navBarRoot: options.navBarRoot || document.body,
            navBarDraggable: (options.navBarDraggable !== undefined && options.navBarDraggable !== null) ? options.navBarDraggable : true,
            navBarCollapsable: (options.navBarCollapsable !== undefined && options.navBarCollapsable !== null) ? options.navBarCollapsable : true,
            pieceNameGroupSeparator: options.pieceNameGroupSeparator
        };


        let isNavBarOpen = (options.navBarCollapsed != undefined && options.navBarCollapsed != null) ? !options.navBarCollapsed : false;

        if (isNavBarOpen) {
            this.setNavBarCollapsed(false);
        } else {
            this.setNavBarCollapsed(true);
        }


        this.showBar(barOptions);

        /**
         * options.overlayRoot - say where search for pieces
         */
        this.showHoverOverlay(options.overlayRoot || document.body);

        /**
         * Enable pieces editing if set option 'editorActive'
         */
        if (options.editorActive) {
            this.store.dispatch(piecesToggleEdit());
        }

        this.onHoverTrack = this._onHoverTrack.bind(this);
        document.addEventListener("mousemove", this.onHoverTrack);

        this.handleKeyUpBinded = this._handleClick.bind(this);
        this._initKeys();
    }

    destroy(){
        document.removeEventListener('keyup', this.handleKeyUpBinded);
    }

    /**
     * @private
     */
    _onHoverTrack(e) {
        const state = this.store.getState();
        const pieces  = state.pieces;
        const pieceHovered  = state.pieces.hoveredId;
        const pieceActive  = state.pieces.activeId;
        let foundId = null;
        let foundRect = null;

        if(pieceActive && pieceActive.length) {
            return;
        }
        if(!pieces.byId) {
            return;
        }
        Object.keys(pieces.byId).forEach((pieceId)=> {

            /**
             * @type RedaxtorPiece
             */
            let piece = pieces.byId[pieceId];

            let enabled = pieces['editorEnabled:' + piece.type];

            if (enabled) {
                const nodeRect = getConfig().api.getNodeRect(piece);
                let rect = nodeRect.hover || nodeRect.node;
                if(rect.top + window.scrollY <= e.pageY && rect.bottom + window.scrollY >= e.pageY &&
                    rect.left <= e.pageX && rect.right >= e.pageX) {
                    foundId = pieceId;
                    foundRect = rect;
                }
            }
        });

        if(pieceHovered != foundId) {
            this.store.dispatch(hoverPiece(foundId, foundRect));
        }

    }

    _initKeys(){
        document.addEventListener('keyup', this.handleKeyUpBinded);
    }

    _handleClick(event){
        switch (event.keyCode) {
            case 27: //is escape
                this._onEscPress();
                break;
            case 0: //if keycode didn't set. for example from manual event (see codemirror)
                if(event.key === "Escape"){
                    this._onEscPress();
                }
                break;
        }
    }

    _onEscPress() {
        let state = this.store.getState();
        if(state.pieces.activeId && state.pieces.activeId.length > 0){
            this.store.dispatch(deactivatePiece(state.pieces.activeId[0]));
        } else {
            this.setEditorActive(false);
        }
    }

    /**
     * Renders a top Redaxtor bar with controls and attach it to body
     */
    showBar(options) {
        this.barNode = document.createElement("DIV");
        ReactDOM.render(
            <Provider store={this.store}>
                <div>
                    <RedaxtorContainer
                        options={options}
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
        options.navBarRoot.appendChild(this.barNode);

    }
    /**
     * Renders tbe hover overlay
     */
    showHoverOverlay(root){
        this.overlayNode = document.createElement("redaxtor-overlay");
        ReactDOM.render(
            <Provider store={this.store}>
                <div>
                    <HoverOverlay components={this.pieces.components} />
                </div>
            </Provider>,
            this.overlayNode
        );
        root.appendChild(this.overlayNode);
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
     * @param options {RedaxtorPieceOptions}
     * @param options.id {string} Mandatory unique identification id of piece. Should present in options OR in `this.pieces.attributeId` attribute of node, i.e. `data-id`
     * @param options.type {string} Mandatory type of piece. Should present in options OR in `this.pieces.attribute` attribute of node, i.e. `data-piece`
     * @param options.name {string} Optional. Human readable name for list in editor. If not specified will be tried to be read from `this.pieces.attributeName` attribute of node
     * @param options.dataset {Object} Optional. Set of random data attributes associated with node that will be passed to save and get API calls. If not specified will be read directly from node dataset.
     * @param options.data {Object} Optional. Set of data associated with piece in format of piece component. If not specified will be fetched.
     */
    addPiece(node, options) {
        let piece = {
            node: node,
            type: (options && options.type) || node.getAttribute(this.pieces.attribute),
            id: (options && options.id) || node.getAttribute(this.pieces.attributeId),
            name: (options && options.name) || node.getAttribute(this.pieces.attributeName),
            dataset: (options && options.dataset) || {},
            changed: false,
            message: '',
            messageLevel: ''
        };
        if (options && options.data) {
            piece.data = options.data;
        }
        if (!options || !options.dataset) {
            for (let data in node.dataset) {
                piece.dataset[data] = node.dataset[data];
            }
        }
        if (!piece.id) throw new Error(`Can't add piece with undefined id`);
        if (!piece.type) throw new Error(`Can't add piece with undefined type`);
        if (!this.pieces.components[piece.type]) throw new Error(`Can't add piece with unsupported type "${piece.type}"`);

        this.store.dispatch(addPiece(piece));
        this.store.dispatch(pieceGet(piece.id));
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
     * Set new data to a piece by piece id
     * @param pieceId {string} id of piece
     * @param data {Object} new data
     */
    setData(pieceId, data) {
        let state = this.store.getState();
        let currentPiece = state.pieces && state.pieces.byId && state.pieces.byId[pieceId];
        if (!currentPiece) {
            throw new Error(`You are trying to set data to an unexisting piece. Piece id: ${pieceId}`)
        }
        if (!currentPiece.fetched) {
            throw new Error(`Piece was not initialized before use setDate function. Piece id: ${pieceId}`)
        }
        this.store.dispatch(setPieceData(pieceId, obj))
    }

    /**
     * Checks if editor toggle is active
     * @param editorType {string} editor type. Optional. If not specified, returns state of "all" toggle
     * @returns {boolean}
     */
    isEditorActive(editorType) {
        let state = this.store.getState();

        if (editorType) {
            return state.pieces['editorEnabled:' + editorType] != undefined ? state.pieces['editorEnabled:' + editorType] : false;
        } else {
            return state.pieces.editorActive != undefined ? state.pieces.editorActive : false;
        }

    }

    /**
     * Check if navbar is collapsed
     * @returns {boolean}
     */
    isNavBarCollapsed() {
        let state = this.store.getState();
        return state.global.navBarCollapsed != undefined ? state.global.navBarCollapsed : true;
    }

    /**
     * Set the active state for editors
     * @param editorActive {boolean} new state
     * @param editorType {string} type of editor, optional. By default applies to "all" toggle.
     */
    setEditorActive(editorActive, editorType) {
        let isActiveNow = this.isEditorActive(editorType);
        if (editorActive != isActiveNow) {
            this.store.dispatch(piecesToggleEdit(editorType));
        }
    }

    /**
     * Set the collapsed state for navbar
     * @param navBarActive {boolean} new state
     */
    setNavBarCollapsed(navBarActive) {
        let isCollapseNow = this.isNavBarCollapsed();
        if (navBarActive != isCollapseNow) {
            this.store.dispatch(piecesToggleNavBar());
        }
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
