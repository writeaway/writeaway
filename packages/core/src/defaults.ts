import { getNodeRect } from 'helpers/getNodeRect';
import { isNodeVisible } from 'helpers/isNodeVisible';
import { defaultPiecesState } from 'reducers/pieces';
import {
  IGlobalState,
  IOptions,
  IPiece, IPieceItemState,
  IPieceWithData,
  IWriteAwayState,
  PieceDataResolver,
  PieceType,
  RedaxtorAPI,
} from 'types';

export const defaultPieces = {
  attribute: 'data-piece',
  attributeId: 'data-id',
  attributeName: 'data-name',
  components: {},
  initialState: {},
};

/**
 * Default minimum api allows basic editing without saving anything
 * No Uploads and gallery
 * TODO: Note this implementation is dependent on submodules. Reimplement as multi-extendable
 */
export const defaultMinimumApi: RedaxtorAPI = {
  getNodeRect,
  isNodeVisible,
  resolvers: {
    background: async (piece: IPieceItemState) => {
      const computedStyle = getComputedStyle(piece.node);
      return Promise.resolve({
        ...piece,
        data: {
          url: computedStyle.backgroundImage && computedStyle.backgroundImage.slice(4, -1).replace(/"/g, ''),
          bgColor: computedStyle.backgroundColor,
          bgRepeat: computedStyle.backgroundRepeat,
          bgSize: computedStyle.backgroundSize,
          bgPosition: computedStyle.backgroundPosition,
          title: piece.node.title || '',
        },
      });
    },
    html: async (piece1: IPieceItemState) => ({
      ...piece1,
      data: {
        html: piece1.node.innerHTML,
        updateNode: true,
      },
    }),
    source: async (piece1: IPieceItemState) => ({
      ...piece1,
      data: {
        html: piece1.node.innerHTML,
        updateNode: true,
      },
    }),
    image: async (piece: IPieceItemState) => ({
      ...piece,
      data: {
        src: (piece.node as HTMLImageElement).src,
        alt: (piece.node as HTMLImageElement).alt,
        title: piece.node.title,
      },
    }),
  },
  getPieceData: async <T extends object = any>(piece: IPieceItemState<T>, resolvers?: Record<PieceType, PieceDataResolver<T>>) => {
    const resolver = resolvers ? resolvers[piece.type] : undefined;
    if (!piece.data && !resolver) {
      throw new Error(`Piece type ${piece.type} has no initial data and has no resolver`);
    }
    if (resolver) {
      return resolver(piece);
    }
    return piece;
  },
  savePieceData(piece) {
    console.warn('Using default implementation for saving piece data. This should be overriden', piece);
    return Promise.resolve(piece);
  },
};

export const defaultOptions: IOptions = {
  pieces: defaultPieces,
  ajax: {},
  enableEdit: true,
  navBarCollapsable: true,
  navBarDraggable: true,
  navBarRoot: document.body,
  overlayRoot: document.body,
  piecesRoot: document.body,
  api: defaultMinimumApi,
  pieceNameGroupSeparator: ',',
};

export const defaultState: IWriteAwayState = {
  global: {
    navBarCollapsed: true,
    expert: false,
  },
  pieces: defaultPiecesState,
  config: {
    ...defaultOptions,
  },
  toastr: undefined as any,
};

export const defaultGlobalState: IGlobalState = { expert: false, navBarCollapsed: false };
