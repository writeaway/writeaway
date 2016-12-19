import React from "react"
import ReactDOM from "react-dom"
import {Provider} from 'react-redux'

import C from "../constants"
import callFetch from '../helpers/callFetch'
import {getStore} from '../store'
import {getConfig} from '../config'

import Container from '../containers/connectPieceContainer';

export const piecesEnableEdit = () => ({type: C.PIECES_ENABLE_EDIT});

export const piecesDisableEdit = () => ({type: C.PIECES_DISABLE_EDIT});

export const piecesInit = () => (dispatch, getState) => {
        const pieces = getState().pieces;
        if (pieces.editorActive) {
            dispatch(piecesEnableEdit());
            if (!pieces.initialized) {
                Object.keys(pieces.byId).forEach(id => {
                    const piece = pieces.byId[id];
                    if (piece.useHTML) {
                        dispatch(pieceFetched(id, {data: {html: piece.node.innerHTML}}));
                        pieceRender(piece);
                    } else {
                        dispatch(pieceGet(id))
                    }
                });
            }
        }
    };


export const piecesToggleEdit = () => (dispatch, getState) => {
        const pieces = getState().pieces, editorActive = !pieces.editorActive;
        if (editorActive) {
            dispatch(piecesEnableEdit());
            if (pieces.initialized) {

            } else {
                Object.keys(pieces.byId).forEach(id => {
                    const piece = pieces.byId[id];
                    if (piece.useHTML) {
                        dispatch(pieceFetched(id, {data: {html: piece.node.innerHTML}}));
                        pieceRender(piece);
                    } else {
                        dispatch(pieceGet(id))
                    }
                });
            }
        } else {
            dispatch(piecesDisableEdit());
        }
    };


export const setSourceId = id => ({type: C.PIECES_SET_SOURCE_ID, id});

export const updatePiece = (id, piece, notChanged) => ({type: C.PIECE_UPDATE, id, piece, notChanged});

export const resetPiece = (id) => ({type: C.PIECE_RESET, id});

export const addPiece = piece => ({type: C.PIECE_ADD, id: piece.id, piece});

export const pieceSaving = id => ({type: C.PIECE_SAVING, id});

export const pieceSaved = (id, answer) => ({type: C.PIECE_SAVED, id, answer});

export const pieceSavingFailed = (id, error) => ({type: C.PIECE_SAVING_FAILED, id, error});

/**
 * Triggers saving piece to server
 * TODO: Extract this to external API
 */
export const savePiece = id => (dispatch, getState) => {
    const piece = getState().pieces.byId[id];
    if(piece.saveURL) {
        dispatch(pieceSaving(id));
        let body = {...piece.dataset, data: piece.data};
        callFetch({url: piece.saveURL, data: body}).then(answer => {
            dispatch(pieceSaved(id, answer));
        }, error => {
            dispatch(pieceSavingFailed(id, error));
        });
    }
};


export const savePieces = pieces => dispatch => {
    Object.keys(pieces).forEach(id => dispatch(savePiece(id)))
};


export const pieceFetching = id => ({type: C.PIECE_FETCHING, id});

export const pieceFetched = (id, piece) => ({type: C.PIECE_FETCHED, id, piece});

export const pieceFetchingFailed = (id, answer) => ({type: C.PIECE_FETCHING_FAILED, id, answer});

export const pieceFetchingError = (id, error) => ({type: C.PIECE_FETCHING_ERROR, id, error});

//TODO: This action should not fetch, should call external interface instead
/**
 * Triggers getting piece data by id
 */
export const pieceGet = id => (dispatch, getState) => {
    dispatch(pieceFetching(id));
    const piece = getState().pieces.byId[id];
    if (!piece) {
        dispatch(pieceFetchingError(id, "This piece does not exist"));
        return;
    }
    /**
     * If Api is set up to fetch pieces from backend, do that
     */
    if (piece.getURL) {
        return callFetch({
            url: piece.getURL,
            data: piece.dataset
        }).then(json => {
            if (!json.piece.data) json.piece.data = {};
            if (!json.piece.data.html) {
                json.piece.data.html = getState().pieces.byId[id].node.innerHTML;
            }
            dispatch(pieceFetched(id, json.piece));
            const piece = getState().pieces.byId[id];
            pieceRender(piece);
        }, error => {
            dispatch(pieceFetchingError(id, error));
        })
    } else {
        /**
         * If no API url, return what is already on page
         */
        dispatch(pieceFetched(id, {
            data: {
                html: getState().pieces.byId[id].node.innerHTML
            }
        }));
        const piece = getState().pieces.byId[id];
        pieceRender(piece);
    }
};


const pieceRender = piece =>
    ReactDOM.render(
        <Provider store={getStore()}>
            <Container id={piece.id}
                       component={getConfig().pieces.components[piece.type]} targetNode={piece.node}
            />
        </Provider>, piece.node);
