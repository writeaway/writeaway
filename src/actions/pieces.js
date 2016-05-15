import React from "react"
import ReactDOM from "react-dom"
import {Provider} from 'react-redux'

import C from "../constants"
import callFetch from '../helpers/callFetch'
import {getStore} from '../store'
import {getConfig} from '../config'

import Container from '../containers/connectPieceContainer';

export const piecesEnableEdit = () => {
    return {type: C.PIECES_ENABLE_EDIT}
};

export const piecesDisableEdit = () => {
    return {type: C.PIECES_DISABLE_EDIT}
};

export const piecesToggleEdit = () => {
    return (dispatch, getState) => {
        const pieces = getState().pieces, edit = !pieces.edit;
        if (edit) {
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
};

export const setSourceId = id => {
    return {type: C.PIECES_SET_SOURCE_ID, id}
};

export const updatePiece = (id, piece, notChanged) => {
    return {type: C.PIECE_UPDATE, id, piece, notChanged}
}

export const addPiece = piece => {
    return {type: C.PIECE_ADD, id: piece.id, piece}
}

export const pieceSaving = id => {
    return {type: C.PIECE_SAVING, id}
}

export const pieceSaved = (id, answer) => {
    return {type: C.PIECE_SAVED, id, answer}
}

export const pieceSavingFailed = (id, error) => {
    return {type: C.PIECE_SAVING_FAILED, id, error}
}

export const savePiece = id => {
    return (dispatch, getState) => {
        dispatch(pieceSaving(id));
        const piece = getState().pieces.byId[id];
        let body = {...piece.dataset, data: piece.data};
        callFetch({url: piece.saveURL, data: body}).then(answer => {
            dispatch(pieceSaved(id, answer));
        }, error => {
            dispatch(pieceSavingFailed(id, error));
        });
    }
}

export const savePieces = pieces => {
    return dispatch => {
        Object.keys(pieces).forEach(id => dispatch(savePiece(id)))
    }
}

export const pieceFetching = id => {
    return {type: C.PIECE_FETCHING, id}
}

export const pieceFetched = (id, piece) => {
    return {type: C.PIECE_FETCHED, id, piece}
}

export const pieceFetchingFailed = (id, answer) => {
    return {type: C.PIECE_FETCHING_FAILED, id, answer}
}

export const pieceFetchingError = (id, error) => {
    return {type: C.PIECE_FETCHING_ERROR, id, error}
}

export const pieceGet = id => {
    return (dispatch, getState) => {
        dispatch(pieceFetching(id));
        const piece = getState().pieces.byId[id];
        return callFetch({
            url: piece.getURL,
            data: piece.dataset
        }).then(json => {
            if (!json.piece.data) json.piece.data = {};
            if (!json.piece.data.html) {
                json.piece.usedPageHTML = true;
                json.piece.data.html = getState().pieces.byId[id].node.innerHTML;
            }
            dispatch(pieceFetched(id, json.piece));

            const piece = getState().pieces.byId[id];
            pieceRender(piece);
        }, error => {
            dispatch(pieceFetchingError(id, error));
        })

    }
}

const pieceRender = piece => {
    ReactDOM.render(
        <Provider store={getStore()}>
            <Container id={piece.id}
                       component={getConfig().pieces.components[piece.type]}
            />
        </Provider>, piece.node);
};