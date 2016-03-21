import C from '../constants'

const piece = (piece = {}, action) => {
    switch (action.type) {
        case C.PIECE_UPDATE:
            return {...piece, ...action.piece, changed: true}
        case C.PIECE_SAVING:
            return {...piece, saving: true}
        case C.PIECE_SAVED:
            return {...piece, changed: false, saving: false}
        case C.PIECE_SAVING_FAILED:
            return {...piece, error: action.error, saving: false}
        
        case C.PIECE_GETTING:
            return {...piece, got: false, getting: true}
        case C.PIECE_GOT:
            return {...piece, ...action.value, got: true, getting: false}
        default:
            return piece
    }
}

const pieces = (pieces = {}, action) => {
    switch (action.type) {
        case C.PIECE_ADD:
            return {...pieces, ...{[action.id]: action.piece}}
        case C.PIECE_UPDATE:
        case C.PIECE_SAVING:
        case C.PIECE_SAVED:
        case C.PIECE_GETTING:
        case C.PIECE_GOT:
            return {...pieces, ...{[action.id]: piece(pieces[action.id], action)}}
        default:
            return pieces
    }
}

export default pieces;

