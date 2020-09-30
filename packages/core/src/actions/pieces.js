import React from "react"
import ReactDOM from "react-dom"
import {Provider} from 'react-redux'
import {toastr} from 'react-redux-toastr'

import C from "../constants.js"
import {getStore} from '../store.js'
import {getConfig} from '../config.js'

import Container from '../containers/connectPieceContainer.js';


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

export const deactivatePiece = id => ({type: C.PIECES_DEACTIVATE_PIECE, id});

export const onDeactivationSentPiece = id => ({type: C.PIECES_DEACTIVATION_SENT_PIECE, id});

export const updatePiece = (id, piece, notChanged) => ({type: C.PIECE_UPDATE, id, piece, notChanged});

export const resetPiece = (id) => ({type: C.PIECE_RESET, id});

export const addPiece = piece => ({type: C.PIECE_ADD, id: piece.id, piece});

export const hoverPiece = (pieceId, rect) => ({type: C.PIECES_HOVERED, id: pieceId, rect: rect});

export const onEditorActive = (pieceId, active) => (dispatch, getState) => {

    const activeId = getState().pieces.activeId || [];

    /**
     * Before actually activating, check if we need to force a hover over elements becoming active
     * TODO: Reducer is a better place for that, but how to use getBoundingClientRect there and not mess up reducers purity?
     */
    if(active && activeId.length == 0) {
        // That editor is now the active editor, invoke hover
        const piece = getState().pieces.byId[pieceId];
        const nodeRect = getConfig().api.getNodeRect(piece);
        dispatch(hoverPiece(pieceId, nodeRect.hover || nodeRect.node));
    }

    if(!active && activeId.length == 2) {
        // That editor is `other` one, after disactivation, only one is left
        const newHoverId = (pieceId === activeId[0])?activeId[1]:activeId[0];
        const piece = getState().pieces.byId[newHoverId];
        const nodeRect = getConfig().api.getNodeRect(piece);
        dispatch(hoverPiece(newHoverId, nodeRect.hover || nodeRect.node));
    }

    if(!active && activeId.length == 1 && pieceId === activeId[0]) {
        // We are going to disactivate all. Good chance to disable hover overlay too
        dispatch(hoverPiece(null));
    }

    dispatch({type: C.PIECES_EDITOR_ACTIVE, id: pieceId, active: active});
};



export const onNodeResized = (pieceId)  => (dispatch, getState) => {
    const piece = getState().pieces.byId[pieceId];
    const hoveredId = getState().pieces.hoveredId;
    const activeId = getState().pieces.activeId;

    if(hoveredId == pieceId) {
        const nodeRect = getConfig().api.getNodeRect(piece);
        dispatch(hoverPiece(pieceId, nodeRect.hover || nodeRect.node));
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

    //chaining actions
    Promise.resolve(dispatch(pieceMessageSetted(id, message, messageLevel)))
        .then(()=>{
        switch (messageLevel) {
            case "error":
                toastr.error('Error', `Piece '${id}': ${message}`);
                break;
            case "warning":
                toastr.warning('Warning', `Piece '${id}': ${message}`);
                break;
        }
    })
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

    /**
     * Generate a copy that anyone from external API can modify and send back without immutability worries
     * @type {IRedaxtorPiece}
     */
    const mutableCopy = {
        ...piece,
        data: piece.data? {...piece.data} : void 0,
    };

    getConfig().api.getPieceData(mutableCopy).then((updatedPiece)=> {
        if(!updatedPiece.data) {
            dispatch(pieceFetchingError(id, "Api method generated no data"));
        } else {
            /**
             * Generate a copy again so evil user can't modify our object by storing reference
             * Note we don't care what is done to `dataset` field
             * @type {IRedaxtorPiece}
             */
            const updatedMutableCopy = {
                ...updatedPiece,
                data: {...updatedPiece.data}
            };

            dispatch(pieceFetched(id, updatedMutableCopy));
            const piece = getState().pieces.byId[id];
            pieceRender(piece);
        }
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

    // Add few attributes. They are used only for visual information in browser inspector
    containerNode.setAttribute("rx:id", piece.id);
    containerNode.setAttribute("rx:type", piece.type);
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
