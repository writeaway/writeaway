import { ToastrState } from 'react-redux-toastr';
import { AnyAction, Store as StoreRaw } from 'redux';
import type { ThunkAction, ThunkDispatch } from 'redux-thunk';

export type PieceDataResolver<DataType = any> =
  (piece: IPieceItemState<DataType>,
    resolvers?: Record<PieceType,
    PieceDataResolver<DataType>>) =>
  Promise<IPieceItemState<DataType>>;

export interface RedaxtorAPI {
  getImageList?: () => unknown,
  uploadImage?: () => unknown,
  isNodeVisible: (piece: unknown) => boolean,
  getNodeRect: (piece: IPiece) => { node: Rect, hover?: Rect },
  getPieceData: PieceDataResolver,
  savePieceData: (piece: IPieceWithData) => Promise<unknown>,
  resolvers: Partial<Record<PieceType, PieceDataResolver>>
}

export type PieceType = 'source' | 'background' | 'html' | 'image';

export interface IPiece<DataType = any> {
  node: HTMLElement;
  type: PieceType;
  data?: DataType;
  dataset?: Record<string, string | undefined>;
}

export interface IPieceItemState<DataType = any> extends IPiece<DataType> {
  id: string,
  name: string,
  messageLevel: string,
  message: string,
  changed?: boolean,
  initialized?: boolean,
  destroy?: boolean,
  fetching?: boolean,
  fetched?: boolean,
}

export interface IPieceWithData<DataType = any> extends IPiece<DataType> {
  data: DataType;
}

export interface IPiecesOptions {
  attribute: string,
  attributeId: string,
  attributeName: string,
  initialState: any,
  components: Partial<Record<PieceType, IComponent>>
}

export interface IOptions {
  /**
   * Optional. Set document by default. Set root  element for pieces
   */
  piecesRoot: HTMLElement,
  /**
   * Optional. Default: false, If set enables everything editors for pieces after loading
   */
  enableEdit: boolean,
  /**
   * Optional. Default: document.body, Set place for the Redaxtor bar
   */
  navBarRoot: HTMLElement,
  /**
   * Optional. Default: true, If set `true` enables dragging of the redaxtor panel
   */
  navBarDraggable: boolean,
  /**
   * Can navbar be collapsed
   */
  navBarCollapsable: boolean,
  /**
   * Starting state
   */
  navBarCollapsed?: boolean,
  overlayRoot?: HTMLElement,
  /**
   * Default ajax options
   */
  ajax: Partial<RequestInit>;
  api: RedaxtorAPI;
  pieces: IPiecesOptions;
  pieceNameGroupSeparator: string;
  state?: Partial<IWriteAwayState>;
  /**
   * Start with editors active
   */
  editorActive?: boolean;
  options?: Record<string, any>
}

export interface IPieceControllerState {
  byId: { [id: string]: IPieceItemState },
  editorActive: boolean,
  activeIds?: string[],
  highlight: boolean,
  hoveredId?: string,
  hoveredRect?: Rect,
  sourceId?: string,
  editorEnabled: Partial<Record<PieceType, boolean | undefined>>,
}

export interface IGlobalState {
  navBarCollapsed: boolean,
  expert: boolean,
  message?: {
    content: string,
    type: string,
  }
}

export interface IWriteAwayState {
  config: IOptions,
  global: IGlobalState,
  toastr: ToastrState,
  pieces: IPieceControllerState,
}

export type GetIWriteAwayState = () => IWriteAwayState;

export type IComponent = {
  name: string,
  editLabel: string,
  applyEditor: (node: HTMLElement, data: any) => void,
};

export interface Rect {
  top: number,
  bottom: number,
  left: number,
  right: number,
  width: number,
  height: number,
}

export type Dispatch = ThunkDispatch<IWriteAwayState, {}, AnyAction>;

export type Action = AnyAction | ThunkAction<any, IWriteAwayState, any, any>;

export type Store = StoreRaw<IWriteAwayState> & { dispatch: Dispatch };

export interface BarOptions {
  navBarRoot: HTMLElement,
  navBarDraggable: boolean,
  navBarCollapsable: boolean,
  pieceNameGroupSeparator: string,
}
