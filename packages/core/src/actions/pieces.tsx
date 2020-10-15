import { selectConfig, selectPieces } from 'helpers/selectors';
import { toastr } from 'react-redux-toastr';
import {
  Dispatch, GetIWriteAwayState, IPieceControllerState, IPieceItem, PieceType, Rect,
} from 'types';

import C from '../constants';

export const piecesEnableEdit = (subType?: PieceType) => ({ type: C.PIECES_ENABLE_EDIT, subType });

export const piecesDisableEdit = (subType?: PieceType) => ({ type: C.PIECES_DISABLE_EDIT, subType });

const piecesRunInit = (dispatch: Dispatch, pieces: IPieceControllerState) => {
  Object.keys(pieces.byId || {}).forEach((id: string) => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    dispatch(pieceGet(id));
  });
};

export const piecesInit = () => (dispatch: Dispatch, getState: GetIWriteAwayState) => {
  const pieces = selectPieces(getState);
  if (pieces.editorActive) {
    dispatch(piecesEnableEdit());
    piecesRunInit(dispatch, pieces);
  }
};

export const piecesToggleEdit = (subType?: PieceType) => (dispatch: Dispatch, getState: GetIWriteAwayState) => {
  const pieces = selectPieces(getState);
  let editorActive = !pieces.editorActive;

  if (subType) {
    editorActive = !pieces.editorEnabled[subType];
  }

  if (editorActive) {
    dispatch(piecesEnableEdit(subType));
    piecesRunInit(dispatch, pieces);
  } else {
    dispatch(piecesDisableEdit(subType));
  }
};

export const setSourceId = (id?: string) => ({ type: C.PIECES_SET_SOURCE_ID, id });

export const activatePiece = (id: string) => ({ type: C.PIECES_ACTIVATE_PIECE, id });

export const onActivationSentPiece = (id: string) => ({ type: C.PIECES_ACTIVATION_SENT_PIECE, id });

export const deactivatePiece = (id: string) => ({ type: C.PIECES_DEACTIVATE_PIECE, id });

export const onDeactivationSentPiece = (id: string) => ({ type: C.PIECES_DEACTIVATION_SENT_PIECE, id });

export const updatePiece = (id: string, piece: Partial<IPieceItem>, notChanged?: boolean) => ({
  type: C.PIECE_UPDATE, id, piece, notChanged,
});

export const resetPiece = (id: string) => ({ type: C.PIECE_RESET, id });

export const addPiece = (piece: IPieceItem) => ({ type: C.PIECE_ADD, id: piece.id, piece });

export const hoverPiece = (pieceId?: string, rect?: Rect) => ({ type: C.PIECES_HOVERED, id: pieceId, rect });

export const onEditorActive = (pieceId: string, active: boolean) => (dispatch: Dispatch, getState: GetIWriteAwayState) => {
  const pieces = selectPieces(getState);
  const config = selectConfig(getState);
  const activeIds = pieces.activeIds || [];

  /**
     * Before actually activating, check if we need to force a hover over elements becoming active
     * TODO: Reducer is a better place for that, but how to use getBoundingClientRect there and not mess up reducers purity?
     */
  if (active && activeIds.length === 0) {
    // That editor is now the active editor, invoke hover
    const piece = pieces.byId[pieceId];
    const nodeRect = config.api.getNodeRect(piece);
    dispatch(hoverPiece(pieceId, nodeRect.hover || nodeRect.node));
  }

  if (!active && activeIds.length === 2) {
    // That editor is `other` one, after disactivation, only one is left
    const newHoverId = (pieceId === activeIds[0]) ? activeIds[1] : activeIds[0];
    const piece = pieces.byId[newHoverId];
    const nodeRect = config.api.getNodeRect(piece);
    dispatch(hoverPiece(newHoverId, nodeRect.hover || nodeRect.node));
  }

  if (!active && activeIds.length === 1 && pieceId === activeIds[0]) {
    // We are going to disactivate all. Good chance to disable hover overlay too
    dispatch(hoverPiece());
  }

  dispatch({ type: C.PIECES_EDITOR_ACTIVE, id: pieceId, active });
};

export const onNodeResized = (pieceId: string) => (dispatch: Dispatch, getState: GetIWriteAwayState) => {
  const pieces = selectPieces(getState);
  const config = selectConfig(getState);
  const piece = pieces.byId[pieceId];
  const { hoveredId } = pieces;

  if (hoveredId === pieceId) {
    const nodeRect = config.api.getNodeRect(piece);
    dispatch(hoverPiece(pieceId, nodeRect.hover || nodeRect.node));
  }
};

export const removePiece = (id: string) => ({ type: C.PIECE_REMOVE, id });

export const setPieceData = (id: string, data: any) => ({ type: C.PIECE_SET_DATA, id, data });

export const pieceMessageSetted = (id: string, message: string, messageLevel: string) => ({
  type: C.PIECE_SET_MESSAGE,
  id,
  message,
  messageLevel,
});

export const hasRemovedPiece = (id: string) => ({ type: C.PIECE_HAS_REMOVED, id });

export const pieceSaving = (id: string) => ({ type: C.PIECE_SAVING, id });

export const pieceSaved = (id: string, answer: unknown) => ({ type: C.PIECE_SAVED, id, answer });

export const pieceSavingFailed = (id: string, error: unknown) => ({ type: C.PIECE_SAVING_FAILED, id, error });

export const setPieceMessage = (id: string, message: string, messageLevel: string) => (dispatch: Dispatch, getState: GetIWriteAwayState) => {
  if (!['warning', 'info', 'error'].includes(messageLevel)) {
    throw new Error(`Wrong message level '${messageLevel}' for PieceId: ${id}`);
  }
  const pieces = selectPieces(getState);

  // chaining actions
  Promise.resolve(dispatch(pieceMessageSetted(id, message, messageLevel)))
    .then(() => {
      const piece = pieces.byId[id];
      switch (messageLevel) {
        case 'error':
          toastr.error('Error', `Piece '${piece.name}': ${message}`);
          break;
        case 'warning':
          toastr.warning('Warning', `Piece '${piece.name}': ${message}`);
          break;
        default:
          break;
      }
    });
};

/**
 * Triggers saving piece to server
 * TODO: Extract this to external API
 */
export const savePiece = (id: string) => (dispatch: Dispatch, getState: GetIWriteAwayState) => {
  const pieces = selectPieces(getState);
  const config = selectConfig(getState);

  const piece = pieces.byId[id];
  // eslint-disable-next-line no-extra-boolean-cast
  if (!!config.api.savePieceData) {
    config.api.savePieceData(piece).then((data: unknown) => {
      dispatch(pieceSaved(id, data));
    }).catch((error: unknown) => {
      dispatch(pieceSavingFailed(id, error));
      setPieceMessage(id, 'Failed to Save', 'error')(dispatch, getState);
    });
  } else {
    dispatch(pieceSaved(id, {}));
  }
};

export const savePieces = (pieces: Record<string, IPieceItem>) => (dispatch: Dispatch) => {
  Object.keys(pieces).forEach((id: string) => dispatch(savePiece(id)));
};

export const pieceFetching = (id: string) => ({ type: C.PIECE_FETCHING, id });

export const pieceFetched = (id: string, piece: IPieceItem) => ({ type: C.PIECE_FETCHED, id, piece });

export const pieceFetchingFailed = (id: string, answer: unknown) => ({ type: C.PIECE_FETCHING_FAILED, id, answer });

export const pieceFetchingError = (id: string, error: unknown) => ({ type: C.PIECE_FETCHING_ERROR, id, error });

/**
 * Triggers getting piece data by id
 */
export const pieceGet = (id: string) => (dispatch: Dispatch, getState: GetIWriteAwayState) => {
  const pieces = selectPieces(getState);
  const config = selectConfig(getState);
  const piece = pieces.byId[id];
  if (!piece) {
    dispatch(pieceFetchingError(id, 'This piece does not exist'));
    return;
  }

  if (piece.initialized || piece.fetching) {
    return; // Don't need to init initialized piece or piece that is already being fetched
  }

  dispatch(pieceFetching(id));

  /**
     * Generate a copy that anyone from external API can modify and send back without immutability worries
     */
  const mutableCopy: IPieceItem = {
    ...piece,
    data: piece.data ? { ...piece.data } : undefined,
  };

  config.api.getPieceData(mutableCopy).then((updatedPiece: IPieceItem) => {
    if (!updatedPiece.data) {
      dispatch(pieceFetchingError(id, 'Api method generated no data'));
    } else {
      const updatedCopy = {
        ...updatedPiece,
        data: { ...updatedPiece.data },
      };
      dispatch(pieceFetched(id, updatedCopy));
      // const pieceUpdated = getState().pieces.byId[id];
      // pieceRender(getState, pieceUpdated);
    }
  }, (error) => {
    dispatch(pieceFetchingError(id, error));
  });
};
