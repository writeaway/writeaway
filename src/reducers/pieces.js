import C from '../constants'

const piece = (piece = {initialized: false}, action) => {
    switch (action.type) {
        case C.PIECE_UPDATE:
            return {
                ...piece, ...action.piece,
                changed: !(action.notChanged || (action.piece.data.html === piece.data.html)) || piece.changed
            };
        case C.PIECE_RESET:
            return {...piece, changed: false};
        case C.PIECE_REMOVE:
            return {...piece, destroy: true};
        case C.PIECE_SET_DATA:
            //check is initiated
            if(!piece.fetched){
                console.error(`Piece was not initialized before use setDate function. Piece id: ${piece.id}`);
                return {...piece};
            }
            else {
                //set data
                return {...piece, data: {...piece.data, ... action.data}};
            }
        case C.PIECE_SET_MESSAGE:
            return {...piece, message: action.message, messageLevel: action.messageLevel};
        case C.PIECE_HAS_REMOVED:
            return {...piece, destroyed: true};
        case C.PIECE_SAVING:
            return {...piece, saving: true};
        case C.PIECE_SAVED:
            return {...piece, changed: false, saving: false};
        case C.PIECE_SAVING_FAILED:
            return {...piece, error: action.error, saving: false};

        case C.PIECE_FETCHING:
            return {...piece, fetched: false, fetching: true};
        case C.PIECE_FETCHED:
            return {...piece, ...action.piece, fetched: true, fetching: false, initialized: true};
        case C.PIECE_FETCHING_FAILED:
            console.error(action.answer);
            return {...piece, fetched: false, fetching: false};
        case C.PIECE_FETCHING_ERROR:
            return {...piece, error: action.error, fetching: false};
        default:
            return piece
    }
};

const piecesDefault = {
    editorActive: true,
    highlight: true,
    sourceId: null
};

const pieces = (pieces = piecesDefault, action) => {
    switch (action.type) {
        case C.PIECES_ENABLE_EDIT:
            if (action.subType) {
                let data = {...pieces, initialized: true};
                data[`editorEnabled:${action.subType}`] = true;
                return data;
            } else {
                return {...pieces, editorActive: true, initialized: true};
            }
        case C.PIECES_DISABLE_EDIT:
            if (action.subType) {
                let data = {...pieces, initialized: true};
                data[`editorEnabled:${action.subType}`] = false;
                return data;
            } else {
                return {...pieces, editorActive: false};
            }
        case C.PIECES_SET_SOURCE_ID:
            return {...pieces, sourceId: action.id};

        case C.PIECE_ADD:
            return {
                ...pieces,
                byId: {...pieces.byId, [action.id]: action.piece}
            };

        case C.PIECE_HAS_REMOVED:
            let byId = {...pieces.byId, [action.id]: action.piece};
            delete byId[action.id];

            return {
                ...pieces,
                byId: byId
            };

        case C.PIECE_SET_DATA:

            //check to existing piece
            if (!pieces.byId[action.id]) {
                console.error(`You are trying to set data to an unexisting piece. Piece id: ${action.id}`);
                return {
                    ...pieces
                };
            }

            return {
                ...pieces,
                byId: {...pieces.byId, [action.id]: piece(pieces.byId[action.id], action)}
            };


        case C.PIECE_UPDATE:
        case C.PIECE_SAVING:
        case C.PIECE_SAVED:
        case C.PIECE_SAVING_FAILED:
        case C.PIECE_REMOVE:
        case C.PIECE_SET_MESSAGE:

        case C.PIECE_FETCHING:
        case C.PIECE_FETCHED:
        case C.PIECE_FETCHING_FAILED:
        case C.PIECE_FETCHING_ERROR:
            return {
                ...pieces,
                byId: {...pieces.byId, [action.id]: piece(pieces.byId[action.id], action)}
            };
        default:
            return pieces
    }
};

export default pieces;

