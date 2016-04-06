import C from "../constants"
import callFetch from '../helpers/fetch'
export const updatePiece = (id, piece) => {
    return {type: C.PIECE_UPDATE, id, piece}
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
        const piece = getState().pieces[id];
        let body = {...piece.dataset, data: piece.data}
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

export const setCurrentSourcePieceId = id => {
    return {type: C.SET_PIECE_CURRENT_SOURCE_ID, id}
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
        const piece = getState().pieces[id];
        return callFetch({url: piece.getURL, data: piece.dataset}).then(json => {
            if (!json.piece.data) json.piece.data = {};
            if (!json.piece.data.html) {
                json.piece.usedPageHTML = true;
                json.piece.data.html = getState().pieces[id].node.innerHTML;
            }
            dispatch(pieceFetched(id, json.piece));
        }, error => {
            dispatch(pieceFetchingError(id, error));
        })

    }
}