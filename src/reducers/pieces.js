import C from '../constants'

const piece = (piece = {}, action) => {
    switch (action.type) {
        case C.UPDATE_PIECE:
            return {...piece, ...action.piece, changed: true}
        case C.SAVING_PIECE:
            return {...piece, saving: true}
        case C.PIECE_SAVED:
            return {...piece, changed: false, saving: false}
        case C.PIECE_SAVING_FAILED:
            return {...piece, error: action.error, saving: false}
        default:
            return piece
    }
}

const pieces = (pieces = {}, action) => {
    switch (action.type) {
        case C.ADD_PIECE:
            return {...pieces, ...{[action.id]: action.piece}}
        case C.UPDATE_PIECE:
        case C.SAVING_PIECE:
        case C.PIECE_SAVED:
            return {...pieces, ...{[action.id]: piece(pieces[action.id], action)}}
        default:
            return pieces
    }
}

export default pieces;

