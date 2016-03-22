import C from "../constants"

export const toggleEdit = () => {
    return {type: C.TOGGLE_EDIT}
}

export const toggleHighlight = () => {
    return {type: C.TOGGLE_HIGHLIGHT}
}

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
        let body = {
            id: piece.id,
            value: piece.data
        }
        if (piece.contentId) body.contentId = piece.contentId;

        fetch(piece.saveURL, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(answer => {
            dispatch(pieceSaved(id, answer));
        }).catch(error => {
            dispatch(pieceSavingFailed(id, error));
        });
    }
}

export const savePieces = pieces => {
    return dispatch => {
        Object.keys(pieces).forEach(id => dispatch(savePiece(id)))
    }
}

export const pieceGetting = id => {
    return {type: C.PIECE_GETTING, id}
}

export const pieceGot = (id, answer) => {
    return {type: C.PIECE_GOT, id, answer}
}

export const pieceGettingFailed = (id, error) => {
    return {type: C.PIECE_GETTING_FAILED, id, error}
}

export const pieceGet = id => {
    return (dispatch, getState) => {
        dispatch(pieceGetting(id));
        const piece = getState().pieces[id];
        let body = {
            id: piece.id
        }
        if (piece.contentId) body.contentId = piece.contentId;
        return fetch(piece.getURL, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(answer => {
            dispatch(pieceGot(id, answer));
        }).catch(error => {
            dispatch(pieceGettingFailed(id, error));
        });
    }
}