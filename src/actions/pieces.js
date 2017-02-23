import React from "react"
import ReactDOM from "react-dom"
import {Provider} from 'react-redux'

import C from "../constants"
import {getStore} from '../store'
import {getConfig} from '../config'

import Container from '../containers/connectPieceContainer';

export const piecesEnableEdit = (subType) => ({type: C.PIECES_ENABLE_EDIT, subType});

export const piecesDisableEdit = (subType) => ({type: C.PIECES_DISABLE_EDIT, subType});

const piecesRunInit = (dispatch, pieces)=> {
    pieces.byId && Object.keys(pieces.byId).forEach(id => {
        dispatch(pieceGet(id))
    });
};

export const piecesInit = () => (dispatch, getState) => {
    const pieces = getState().pieces;
    if (pieces.editorActive) {
        dispatch(piecesEnableEdit());
        piecesRunInit(dispatch, pieces);
    }
};


export const piecesToggleEdit = (subType) => (dispatch, getState) => {
    const pieces = getState().pieces;
    let editorActive = !pieces.editorActive;

    if (subType) {
        editorActive = !pieces[`editorEnabled:${subType}`];
    }
    if (editorActive) {
        dispatch(piecesEnableEdit(subType));
        piecesRunInit(dispatch, pieces);
    } else {
        dispatch(piecesDisableEdit(subType));
    }
};


export const setSourceId = id => ({type: C.PIECES_SET_SOURCE_ID, id});

export const activatePiece = id => ({type: C.PIECES_ACTIVATE_PIECE, id});

export const onActivationSentPiece = id => ({type: C.PIECES_ACTIVATION_SENT_PIECE, id});

export const updatePiece = (id, piece, notChanged) => ({type: C.PIECE_UPDATE, id, piece, notChanged});

export const resetPiece = (id) => ({type: C.PIECE_RESET, id});

export const addPiece = piece => ({type: C.PIECE_ADD, id: piece.id, piece});

export const hoverPiece = (pieceId, rect) => ({type: C.PIECES_HOVERED, id: pieceId, rect: rect});

export const onEditorActive = (pieceId, active) => ({type: C.PIECES_EDITOR_ACTIVE, id: pieceId, active: active});

export const onNodeResized = (pieceId)  => (dispatch, getState) => {
    const piece = getState().pieces.byId[pieceId];
    const hoveredId = getState().pieces.hoveredId;
    const activeId = getState().pieces.activeId;

    if(hoveredId == pieceId) {
        dispatch(hoverPiece(pieceId, piece.node.getBoundingClientRect()));
    }
};

export const removePiece = id => ({type: C.PIECE_REMOVE, id: id});

export const setPieceData = (id, data) => ({type: C.PIECE_SET_DATA, id: id, data: data});

export const pieceMessageSetted = (id, message, messageLevel) => ({
    type: C.PIECE_SET_MESSAGE,
    id,
    message,
    messageLevel
});

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
    if (getConfig().api.savePieceData) {
        getConfig().api.savePieceData(piece).then((data)=> {
            dispatch(pieceSaved(id, data));
        }, error => {
            dispatch(pieceSavingFailed(id, error));
            setPieceMessage(id, `Couldn't save`, 'error')(dispatch);
        })
    } else {
        dispatch(pieceSaved(id, {}));
    }
};

export const setPieceMessage = (id, message, messageLevel) => dispatch => {
    if (!['warning', 'info', 'error'].includes(messageLevel)) {
        throw new Error(`Wrong message level '${messageLevel}' for PieceId: ${id}`);
    }

    dispatch(pieceMessageSetted(id, message, messageLevel))
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
    const piece = getState().pieces.byId[id];
    if (!piece) {
        dispatch(pieceFetchingError(id, "This piece does not exist"));
        return;
    }

    if (piece.initialized || piece.fetching) {
        return; // Don't need to init initialized piece or piece that is already being fetched
    }

    dispatch(pieceFetching(id));

    getConfig().api.getPieceData(piece).then((updatedPiece)=> {
        dispatch(pieceFetched(id, updatedPiece));
        const piece = getState().pieces.byId[id];
        pieceRender(piece);
    }, (error)=> {
        dispatch(pieceFetchingError(id, error));
    });
};

export const pieceUnmount = piece => (dispatch, getState) => {
    if (piece.node.__rdxContainderNode) {
        ReactDOM.unmountComponentAtNode(piece.node.__rdxContainderNode);
        dispatch(hasRemovedPiece(piece.id));
    }
}

const pieceRender = piece => {
    // let ComponentClass = getConfig().pieces.components[piece.type];
    let mainNode = document.querySelector("redaxtor-react-container");
    if(!mainNode) {
        mainNode = document.createElement("redaxtor-react-container");
        document.body.appendChild(mainNode);
    }
    let containerNode = document.createElement("redaxtor-editor");
    mainNode.appendChild(containerNode);
    piece.node.__rdxContainderNode = containerNode;
    return ReactDOM.render(
        <Provider store={getStore()}>
            <Container id={piece.id}
                       component={getConfig().pieces.components[piece.type]} targetNode={piece.node}
            />
        </Provider>, containerNode, (ref)=> {
            piece.node.__rdxRef = ref;
        });
};
