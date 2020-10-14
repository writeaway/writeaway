import { AnyAction, Reducer } from 'redux';
import { IPieceControllerState, IPieceItem, PieceType } from 'types';
import C from '../constants';

const piece = (pItem: IPieceItem, action: AnyAction) => {
  switch (action.type) {
    case C.PIECE_UPDATE:
      return {
        ...pItem,
        ...action.piece,
        changed: !(action.notChanged || (action.piece.data.html === pItem.data.html)) || pItem.changed,
      };
    case C.PIECE_RESET:
      return { ...pItem, changed: false };
    case C.PIECE_REMOVE:
      return { ...pItem, destroy: true };
    case C.PIECE_SET_DATA:
      // check is initiated
      if (!pItem.fetched) {
        // eslint-disable-next-line no-console
        console.error(`Piece was not initialized before use setDate function. Piece id: ${pItem.id}`);
        return { ...pItem };
      }
      // set data
      return { ...pItem, data: { ...pItem.data, ...action.data } };

    case C.PIECE_SET_MESSAGE:
      return { ...pItem, message: action.message, messageLevel: action.messageLevel };
    case C.PIECE_HAS_REMOVED:
      return { ...pItem, destroyed: true };
    case C.PIECE_SAVING:
      return { ...pItem, saving: true };
    case C.PIECE_SAVED:
      return { ...pItem, changed: false, saving: false };
    case C.PIECE_SAVING_FAILED:
      return { ...pItem, error: action.error, saving: false };

    case C.PIECE_FETCHING:
      return { ...pItem, fetched: false, fetching: true };
    case C.PIECE_FETCHED:
      return {
        ...pItem, ...action.piece, fetched: true, fetching: false, initialized: true,
      };
    case C.PIECE_FETCHING_FAILED:
      // eslint-disable-next-line no-console
      console.error(action);
      return { ...pItem, fetched: false, fetching: false };
    case C.PIECE_FETCHING_ERROR:
      return { ...pItem, error: action.error, fetching: false };
    case C.PIECES_ACTIVATE_PIECE:
      return { ...pItem, manualActivation: true };
    case C.PIECES_ACTIVATION_SENT_PIECE:
      return { ...pItem, manualActivation: false };
    case C.PIECES_DEACTIVATE_PIECE:
      return { ...pItem, manualDeactivation: true };
    case C.PIECES_DEACTIVATION_SENT_PIECE:
      return { ...pItem, manualDeactivation: false };
    case C.PIECES_EDITOR_ACTIVE:
      return { ...pItem, active: action.active };
    default:
      return pItem;
  }
};

export const defaultPiecesState: IPieceControllerState = {
  editorEnabled: {},
  editorActive: true,
  highlight: true,
  activeIds: [],
  byId: {},
};

const pieces: Reducer<IPieceControllerState> = (pState: IPieceControllerState = defaultPiecesState, action: AnyAction) => {
  switch (action.type) {
    case C.PIECES_ENABLE_EDIT:
      if (action.subType) {
        const data = { ...pState, initialized: true };
        data.editorEnabled[action.subType as PieceType] = true;
        return data;
      }
      return { ...pState, editorActive: true, initialized: true };

    case C.PIECES_DISABLE_EDIT:
      if (action.subType) {
        const data = { ...pState, initialized: true };
        data.editorEnabled[action.subType as PieceType] = false;
        return data;
      }
      return { ...pState, editorActive: false };

    case C.PIECES_SET_SOURCE_ID:
      return { ...pState, sourceId: action.id };

    case C.PIECE_ADD:
      return {
        ...pState,
        byId: { ...pState.byId, [action.id]: action.piece },
      };

    case C.PIECE_HAS_REMOVED: {
      const byId: { [id: string]: IPieceItem } = { ...pState.byId, [action.id]: action.piece };
      delete byId[action.id];

      return {
        ...pState,
        byId,
      };
    }

    case C.PIECE_SET_DATA:

      // check to existing piece
      if (!pState.byId[action.id]) {
        // eslint-disable-next-line no-console
        console.error(`You are trying to set data to an unexisting piece. Piece id: ${action.id}`);
        return {
          ...pState,
        };
      }

      return {
        ...pState,
        byId: { ...pState.byId, [action.id]: piece(pState.byId[action.id], action) },
      };

    case C.PIECE_UPDATE:
    case C.PIECE_SAVING:
    case C.PIECE_SAVED:
    case C.PIECE_SAVING_FAILED:
    case C.PIECE_REMOVE:
    case C.PIECE_SET_MESSAGE:
    case C.PIECES_ACTIVATE_PIECE:
    case C.PIECES_ACTIVATION_SENT_PIECE:
    case C.PIECES_DEACTIVATE_PIECE:
    case C.PIECES_DEACTIVATION_SENT_PIECE:
    case C.PIECE_FETCHING:
    case C.PIECE_FETCHED:
    case C.PIECE_FETCHING_FAILED:
    case C.PIECE_FETCHING_ERROR:
      return {
        ...pState,
        byId: { ...pState.byId, [action.id]: piece(pState.byId[action.id], action) },
      };

    case C.PIECES_EDITOR_ACTIVE: {
      const activeList = pState.activeIds || [];
      if (action.active) {
        if (activeList.indexOf(action.id) === -1) {
          return {
            ...pState,
            activeIds: [...activeList, action.id],
            byId: { ...pState.byId, [action.id]: piece(pState.byId[action.id], action) },
          };
        }
      } else if (activeList.indexOf(action.id) !== -1) {
        return {
          ...pState,
          activeIds: activeList.filter((aid: string) => aid !== action.id),
          byId: { ...pState.byId, [action.id]: piece(pState.byId[action.id], action) },
        };
      }
      return {
        ...pState,
        byId: { ...pState.byId, [action.id]: piece(pState.byId[action.id], action) },
      };
    }

    case C.PIECES_HOVERED:
      return {
        ...pState,
        hoveredId: action.id,
        hoveredRect: action.rect,
      };

    default:
      return pState;
  }
};

export default pieces;
