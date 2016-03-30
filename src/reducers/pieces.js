import C from '../constants'

const piece = (piece = {}, action) => {
    switch (action.type) {
        case C.PIECE_UPDATE:
            return {...piece, ...action.piece, changed: true};
        case C.PIECE_SAVING:
            return {...piece, saving: true};
        case C.PIECE_SAVED:
            return {...piece, changed: false, saving: false};
        case C.PIECE_SAVING_FAILED:
            return {...piece, error: action.error, saving: false};

        case C.PIECE_FETCHING:
            return {...piece, fetched: false, fetching: true};
        case C.PIECE_FETCHED:
            return {...piece, ...action.piece, fetched: true, fetching: false};
        case C.PIECE_FETCHING_FAILED:
            console.error(action.answer);
            return {...piece, fetched: false, fetching: false};
        case C.PIECE_FETCHING_ERROR:
            return {...piece, error: action.error, fetching: false};
        default:
            return piece
    }
};

const pieces = (pieces = {}, action) => {
    switch (action.type) {
        case C.PIECE_ADD:
            return {...pieces, ...{[action.id]: action.piece}};
        case C.PIECE_UPDATE:
        case C.PIECE_SAVING:
        case C.PIECE_SAVED:
        case C.PIECE_SAVING_FAILED:

        case C.PIECE_FETCHING:
        case C.PIECE_FETCHED:
        case C.PIECE_FETCHING_FAILED:
        case C.PIECE_FETCHING_ERROR:
            return {...pieces, ...{[action.id]: piece(pieces[action.id], action)}};
        default:
            return pieces
    }
};

export default pieces;

