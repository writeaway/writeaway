import {
  onActivationSentPiece,
  onDeactivationSentPiece,
  onEditorActive, onNodeResized,
  resetPiece,
  savePiece, setPieceMessage, setSourceId,
  updatePiece,
} from 'actions/pieces';
import { ComponentClass } from 'react';
import { ToastrState } from 'react-redux-toastr';
import { AnyAction, Store as StoreRaw } from 'redux';
import type { ThunkAction, ThunkDispatch } from 'redux-thunk';

export type PieceDataResolver<DataType = any> =
  (piece: IPieceItemState<DataType>,
    resolvers?: Partial<Record<PieceType, PieceDataResolver>>) =>
  Promise<IPieceItemState<DataType>>;

export interface GalleryItem {
  id: string,
  src: string,
  thumbnailSrc?: string,
  title?: string,
  alt?: string,
  width?: number,
  height?: number
}

export interface RedaxtorAPI {
  getImageList?: (piece: { id: string, dataset?: { [k: string]: string }}) => Promise<Array<GalleryItem>>,
  uploadImage?: (file: File | FileList) => Promise<GalleryItem | GalleryItem[]>,
  isNodeVisible: (piece: IPieceItemState) => boolean,
  getNodeRect: (piece: IPieceItemState) => { node: Rect, hover?: Rect },
  getPieceData: PieceDataResolver,
  savePieceData: (piece: IPieceItemState) => Promise<IPieceItemState>,
  resolvers: Partial<Record<PieceType, PieceDataResolver>>,
  deleteImage?: (id: string) => Promise<any>
}

export type PieceType = 'source' | 'background' | 'html' | 'image' | 'seo';

export interface IPiece<DataType = any> {
  node: HTMLElement;
  type: PieceType;
  data?: DataType;
  dataset?: { [k: string]: string };
}

export interface IPieceItemState<DataType = any> extends IPiece<DataType> {
  id: string,
  name: string,
  manualActivation?: boolean,
  manualDeactivation?: boolean,
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
   * Can navbar be collapsed
   */
  expert?: boolean,
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

export type PieceActions<DataType = any> = {
  onManualActivation: (id: string) => void,
  onManualDeactivation: (id: string) => void,
  updatePiece: (id: string, piece: Partial<IPieceItemState<DataType>>) => void,
  resetPiece: (id: string) => void,
  savePiece: (id: string) => void,
  onEditorActive: (id: string, active: boolean) => void,
  onNodeResized: (id: string) => void,
  setPieceMessage: (id: string, message: string, messageLevel: string) => void,
  setCurrentSourcePieceId: (id: string) => void,
};

export interface IPieceProps<DataType = any> {
  piece: IPieceItemState<DataType>;
  actions: PieceActions<DataType>;
  expert: boolean;
  editorActive: boolean;
  wrapper: string;
  onClose?: () => void;
  onSave?: (id: string) => void;
  api: RedaxtorAPI;
  options?: any;
  className?: string;
}

export interface IComponent<Data = any> extends ComponentClass<IPieceProps<Data>> {
  label: string,
  editLabel: string,
  applyEditor: (node: HTMLElement, data: any) => void,
}

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
