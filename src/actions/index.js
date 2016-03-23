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

export const setCurrentSourcePieceId = id => {
    return {type: C.SET_PIECE_CURRENT_SOURCE_ID, id}
}

export const pieceFetching = id => {
    return {type: C.PIECE_FETCHING, id}
}

export const pieceFetched = (id, answer) => {
    return {type: C.PIECE_FETCHED, id, answer}
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
        }).then(resp => typeof resp === "object" ? resp : resp.json())
            .then(json => {
                const status = json.status;
                if (status >= 200 && status < 300 || status === 304) {
                    dispatch(pieceFetched(id, json));
                } else {
                    //https://github.com/github/fetch/issues/155
                    //var error = new Error(resp.statusText || resp.status)
                    //     error.response = resp;
                    //     dispatch(pieceGettingFailed(id, error));
                    //     return Promise.reject(error)
                    dispatch(pieceFetchingFailed(id, json));
                }
            }).catch(error => {
                console.log(error);
                dispatch(pieceFetchingError(id, error));
            });
    }
}