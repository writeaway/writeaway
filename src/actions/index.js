import C from "../constants"

export const toggleEdit = () => {
    return {type: C.TOGGLE_EDIT}
}

export const toggleHighlight = () => {
    return {type: C.TOGGLE_HIGHLIGHT}
}

/**
 * @param {string} id
 * @param {object} piece
 */
export const updatePiece = (id, piece) => {
    return {type: C.UPDATE_PIECE, id, piece}
}

export const addPiece = piece => {
    return {type: C.ADD_PIECE, id: piece.id, piece}
}

export const savingPiece = id => {
    return {type: C.SAVING_PIECE, id}
}

export const pieceSaved = (id, answer) => {
    return {type: C.PIECE_SAVED, id, answer}
}

export const pieceSavingFailed = (id, error) => {
    return {type: C.PIECE_SAVING_FAILED, id, error}
}

export const savePiece = id => {
    return (dispatch, getState) => {
        dispatch(savingPiece(id));
        const piece = getState().pieces[id];
        // console.log("savePiece", id, getState().pieces,piece);
        fetch(piece.saveURL, {
            method: "POST",
            body: JSON.stringify(piece.data)
        }).then(answer => {
            dispatch(pieceSaved(id, answer));
        }).catch(error => {
            dispatch(pieceSavingFailed(id, error));
        });
    }
}

export const savePieces = pieces => {
    // console.log("savePieces", pieces)
    return dispatch => {
        Object.keys(pieces).forEach(id => dispatch(savePiece(id)))
    }
}