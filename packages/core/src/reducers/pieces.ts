import { AnyAction, Reducer } from 'redux';
import { IPieceControllerState, IPieceItem, PieceType } from 'types';
import { Actions } from '../constants';

const piece = (pItem: IPieceItem, action: AnyAction) => {
  switch (action.type) {
    case Actions.PIECE_UPDATE:
      return {
        ...pItem,
        ...action.piece,
        changed: !(action.notChanged || (action.piece.data.html === pItem.data.html)) || pItem.changed,
      };
    case Actions.PIECE_RESET:
      return { ...pItem, changed: false };
    case Actions.PIECE_REMOVE:
      return { ...pItem, destroy: true };
    case Actions.PIECE_SET_DATA:
      // check is initiated
      if (!pItem.fetched) {
        // eslint-disable-next-line no-console
        console.error(`Piece was not initialized before use setDate function. Piece id: ${pItem.id}`);
        return { ...pItem };
      }
      // set data
      return { ...pItem, data: { ...pItem.data, ...action.data }, meta: action.meta || pItem.meta };

    case Actions.PIECE_SET_MESSAGE:
      return { ...pItem, message: action.message, messageLevel: action.messageLevel };
    case Actions.PIECE_HAS_REMOVED:
      return { ...pItem, destroyed: true };
    case Actions.PIECE_SAVING:
      return { ...pItem, saving: true };
    case Actions.PIECE_SAVED:
      return { ...pItem, changed: false, saving: false };
    case Actions.PIECE_SAVING_FAILED:
      return { ...pItem, error: action.error, saving: false };

    case Actions.PIECE_FETCHING:
      return { ...pItem, fetched: false, fetching: true };
    case Actions.PIECE_FETCHED:
      return {
        ...pItem, ...action.piece, fetched: true, fetching: false, initialized: true,
      };
    case Actions.PIECE_FETCHING_FAILED:
      // eslint-disable-next-line no-console
      console.error(action);
      return { ...pItem, fetched: false, fetching: false };
    case Actions.PIECE_FETCHING_ERROR:
      return { ...pItem, error: action.error, fetching: false };
    case Actions.PIECES_ACTIVATE_PIECE:
      return { ...pItem, manualActivation: true };
    case Actions.PIECES_ACTIVATION_SENT_PIECE:
      return { ...pItem, manualActivation: false };
    case Actions.PIECES_DEACTIVATE_PIECE:
      return { ...pItem, manualDeactivation: true };
    case Actions.PIECES_DEACTIVATION_SENT_PIECE:
      return { ...pItem, manualDeactivation: false };
    case Actions.PIECES_EDITOR_ACTIVE:
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
    case Actions.PIECES_ENABLE_EDIT:
      if (action.subType) {
        const data = { ...pState, initialized: true };
        data.editorEnabled = { ...data.editorEnabled, [action.subType as PieceType]: true };
        return data;
      }
      return { ...pState, editorActive: true, initialized: true };

    case Actions.PIECES_DISABLE_EDIT:
      if (action.subType) {
        const data = { ...pState, initialized: true };
        data.editorEnabled = { ...data.editorEnabled, [action.subType as PieceType]: false };
        return data;
      }
      return { ...pState, editorActive: false };

    case Actions.PIECES_SET_SOURCE_ID:
      return { ...pState, sourceId: action.id };

    case Actions.PIECE_ADD:
      return {
        ...pState,
        byId: { ...pState.byId, [action.id]: action.piece },
      };

    case Actions.PIECE_HAS_REMOVED: {
      const byId: { [id: string]: IPieceItem } = { ...pState.byId, [action.id]: action.piece };
      delete byId[action.id];

      return {
        ...pState,
        byId,
      };
    }

    case Actions.PIECE_SET_DATA:

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

    case Actions.PIECE_UPDATE:
    case Actions.PIECE_SAVING:
    case Actions.PIECE_SAVED:
    case Actions.PIECE_SAVING_FAILED:
    case Actions.PIECE_REMOVE:
    case Actions.PIECE_SET_MESSAGE:
    case Actions.PIECES_ACTIVATE_PIECE:
    case Actions.PIECES_ACTIVATION_SENT_PIECE:
    case Actions.PIECES_DEACTIVATE_PIECE:
    case Actions.PIECES_DEACTIVATION_SENT_PIECE:
    case Actions.PIECE_FETCHING:
    case Actions.PIECE_FETCHED:
    case Actions.PIECE_FETCHING_FAILED:
    case Actions.PIECE_FETCHING_ERROR:
      return {
        ...pState,
        byId: { ...pState.byId, [action.id]: piece(pState.byId[action.id], action) },
      };

    case Actions.PIECES_EDITOR_ACTIVE: {
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

    case Actions.PIECES_HOVERED:
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
