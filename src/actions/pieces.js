import React from "react"
import ReactDOM from "react-dom"
import {Provider} from 'react-redux'

import C from "../constants"
import {getStore} from '../store'
import {getConfig} from '../config'

import Container from '../containers/connectPieceContainer';

export const piecesEnableEdit = (subType) => ({type: C.PIECES_ENABLE_EDIT, subType});

export const piecesDisableEdit = (subType) => ({type: C.PIECES_DISABLE_EDIT, subType});

const piecesRunInit = (dispatch, pieces)=>{
    Object.keys(pieces.byId).forEach(id => {
        dispatch(pieceGet(id))
    });
};

export const piecesInit = () => (dispatch, getState) => {
        const pieces = getState().pieces;
        if (pieces.editorActive) {
            dispatch(piecesEnableEdit());
            if (!pieces.initialized) {
                piecesRunInit(dispatch, pieces);
            }
        }
    };


export const piecesToggleEdit = (subType) => (dispatch, getState) => {
        const pieces = getState().pieces; let editorActive = !pieces.editorActive;
        if(subType) {
            editorActive = !pieces[`editorEnabled:${subType}`];
        }
        if (editorActive) {
            dispatch(piecesEnableEdit(subType));
            if (!pieces.initialized) {
                piecesRunInit(dispatch, pieces);
            }
        } else {
            dispatch(piecesDisableEdit(subType));
        }
    };


export const setSourceId = id => ({type: C.PIECES_SET_SOURCE_ID, id});

export const updatePiece = (id, piece, notChanged) => ({type: C.PIECE_UPDATE, id, piece, notChanged});

export const resetPiece = (id) => ({type: C.PIECE_RESET, id});

export const addPiece = piece => ({type: C.PIECE_ADD, id: piece.id, piece});

export const removePiece = id => ({type: C.PIECE_REMOVE, id: id});

export const hasRemovedPiece = id => ({type: C.PIECE_HAS_REMOVED, id: id});

export const pieceSaving = id => ({type: C.PIECE_SAVING, id});

export const pieceSaved = (id, answer) => ({type: C.PIECE_SAVED, id, answer});

export const pieceSavingFailed = (id, error) => ({type: C.PIECE_SAVING_FAILED, id, error});

/**
 * Triggers saving piece to server
 * TODO: Extract this to external API
 */
export const savePiece = id => (dispatch, getState) => {
    const piece = getState().pieces.byId[id];
    if(getConfig().api.savePieceData) {
        getConfig().api.savePieceData(piece).then((data)=>{
            dispatch(pieceSaved(id, data));
        }, error =>{
            dispatch(pieceSavingFailed(id, error));
        })
    } else {
        dispatch(pieceSaved(id, {}));
    }
};


export const savePieces = pieces => dispatch => {
    Object.keys(pieces).forEach(id => dispatch(savePiece(id)))
};


export const pieceFetching = id => ({type: C.PIECE_FETCHING, id});

export const pieceFetched = (id, piece) => ({type: C.PIECE_FETCHED, id, piece});

export const pieceFetchingFailed = (id, answer) => ({type: C.PIECE_FETCHING_FAILED, id, answer});

export const pieceFetchingError = (id, error) => ({type: C.PIECE_FETCHING_ERROR, id, error});

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
    getConfig().api.getPieceData(piece).then((updatedPiece)=>{
        dispatch(pieceFetched(id, updatedPiece));
        const piece = getState().pieces.byId[id];
        pieceRender(piece);
    }, (error)=>{
        dispatch(pieceFetchingError(id, error));
    });
};

export const pieceUnmount = piece => (dispatch, getState) => {
    if(piece.node.__rdxContainderNode) {
        ReactDOM.unmountComponentAtNode(piece.node.__rdxContainderNode);
        dispatch(hasRemovedPiece(piece.id));
    }
}

const pieceRender = piece => {
    let ComponentClass = getConfig().pieces.components[piece.type];
    if(ComponentClass.__renderType === "INSIDE") {
        piece.node.__rdxContainderNode = piece.node;
        return ReactDOM.render(
            <Provider store={getStore()}>
                <Container id={piece.id}
                           component={getConfig().pieces.components[piece.type]} targetNode={piece.node}
                />
            </Provider>, piece.node);
    }
    if(ComponentClass.__renderType === "BEFORE") {
        let containerNode = document.createElement("redaxtor-before");
        piece.node.parentNode.insertBefore(containerNode, piece.node);
        piece.node.__rdxContainderNode = containerNode;
        return ReactDOM.render(
            <Provider store={getStore()}>
                <Container id={piece.id}
                           component={getConfig().pieces.components[piece.type]} targetNode={piece.node}
                />
            </Provider>, containerNode);
    }
    throw new Error("Component class has no __renderType specified or __renderType is not supported");
}
