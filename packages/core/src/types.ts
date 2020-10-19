/**
 * @packageDocumentation
 * @module Types
 */

import { ComponentClass } from 'react';
import { ToastrState } from 'react-redux-toastr';
import { AnyAction, Store as StoreRaw } from 'redux';
import type { ThunkAction, ThunkDispatch } from 'redux-thunk';

export type PieceDataResolver<DataType = any> =
  (piece: IPieceItem<DataType>,
   resolvers?: Partial<Record<PieceType, PieceDataResolver>>) =>
    Promise<IPieceItem<DataType>>;

/**
 * Image gallery item
 */
export interface GalleryItem {
  /**
   * Unique id of image
   */
  id: string,
  /**
   * Source for image
   */
  src: string,
  /**
   * Optional thumbnail
   */
  thumbnailSrc?: string,
  /**
   * Optional title for `title` attribute
   */
  title?: string,
  /**
   * Optional alt title for `alt` attribute
   */
  alt?: string,
  /**
   * Width of image, if not specified, will be detected if needed
   */
  width?: number,
  /**
   * Height of image, if not specified, will be detected if needed
   */
  height?: number
}

/**
 * Subscribe to piece updates coming from external source, i.e. websockets
 * @param fn - subscription function
 * Should return an unsubscribe function
 */
export type PieceSubscription = (fn: (piece: Partial<IPieceItem>) => boolean) => () => void;

/**
 * Resolve conflicts between current in-state piece data and data coming from external source
 * Should resolve as data that needs to be applied
 * @param current - current state of piece
 * @param external - external state of piece
 */
export type PieceConflictResolver = (current: IPieceItem, external: IPieceItem) => IPieceItem;

/**
 * Interface that should be implemented for editors
 */
export interface IPiecesAPI {
  /**
   * Subscribe to piece updates coming from external source, i.e. websockets
   * @param fn - subscription function
   * Should return an unsubscribe function
   */
  subscribe?: PieceSubscription;
  /**
   * Resolve conflicts between current in-state piece data and data coming from external source
   * Should resolve as data that needs to be applied
   * @param current - current state of piece
   * @param external - external state of piece
   */
  resolveConflict?: PieceConflictResolver
  /**
   * Resolve piece data from server or other source
   */
  getPieceData: PieceDataResolver,
  /**
   * Persist piece data on server or other target
   */
  savePieceData: (piece: IPieceItem) => Promise<IPieceItem>,
  /**
   * Checks if node is visible on current page
   */
  isNodeVisible: (piece: IPieceItem) => boolean,
  /**
   * Resolves piece rectangle to display hover rectangle
   */
  getNodeRect: (piece: IPieceItem) => { node: Rect, hover?: Rect },
  /**
   * Specifies piece data resolvers per piece type
   */
  resolvers: Partial<Record<PieceType, PieceDataResolver>>,
  /**
   * Delete image by id. If not specified delete operation will be disabled
   */
  deleteImage?: (id: string) => Promise<any>
  /**
   * Get image gallery. If not specified gallery will be disabled
   */
  getImageList?: (piece: { id: string, dataset?: { [k: string]: string } }) => Promise<Array<GalleryItem>>,
  /**
   * Upload images. If not specified, upload will be disabled
   */
  uploadImage?: (file: File | FileList) => Promise<GalleryItem | GalleryItem[]>,
}

export type PieceType = 'source' | 'background' | 'html' | 'image' | 'seo';

/**
 * Base piece type
 */
export interface IPiece<DataType = any, Meta = any> {
  /**
   * Unique piece id
   */
  id: string,
  /**
   * Node which piece controls
   */
  node: HTMLElement;
  /**
   * Type of piece
   */
  type: PieceType;
  /**
   * Data of piece, specific to piece type
   */
  data?: DataType;
  /**
   * Meta data for resolving updates in concurrent mode, empty in non-concurrent mode
   */
  meta?: Meta;
  /**
   * Human readable piece name
   */
  name: string,
}

/**
 * Piece info state
 */
export interface IPieceItem<DataType = any, Meta = any> extends IPiece<DataType, Meta> {
  /**
   * @deprecated
   */
  manualActivation?: boolean,
  /**
   * @deprecated
   */
  manualDeactivation?: boolean,
  messageLevel: string,
  message: string,
  changed?: boolean,
  initialized?: boolean,
  destroy?: boolean,
  fetching?: boolean,
  fetched?: boolean,
  /**
   * Dataset of node
   */
  dataset?: { [k: string]: string };
}

/**
 * Piece initialization options
 */
export interface IPiecesOptions {
  /**
   * Selector which is looked for pieces auto-init
   * @default "[data-piece]"
   */
  selector: string,
  /**
   * Data attribute that is used to extract piece type from node
   * @default "data-piece"
   */
  attribute: string,
  /**
   * Data attribute that is used to extract piece id from node
   * @default "data-id"
   */
  attributeId: string,
  /**
   * Data attribute that is used to extract piece name from node
   * @default "data-name"
   */
  attributeName: string,
  /**
   * Initial state to merge into piece state
   */
  initialState?: any,
  /**
   * Specifies components used to edit specific piece type
   */
  components: Partial<Record<PieceType, IComponent>>,
  /**
   * Default options per piece type
   */
  options?: Partial<Record<PieceType, any>>,
  /**
   * Name separator for piece names, i.e. if separator is ':' names
   * like 'Body:Article' and 'Body:About' will be grouped under 'Body' with 'Article' and 'About' names
   * @default: ','
   */
  nameGroupSeparator: string;
}

export interface IOptions {
  /**
   * Optional. Default: document. Sets where to search for pieces in stand-alone mode
   */
  piecesRoot: HTMLElement,
  /**
   * Optional. Default: document. Sets where to append piece editors
   */
  editorRoot: HTMLElement,
  /**
   * Optional. Default: false, If set enables everything editors for pieces after loading
   */
  enableEdit: boolean,
  /**
   * Optional. Default: document.body, Set place for the WriteAway bar
   */
  navBarRoot: HTMLElement,
  /**
   * Optional. Default: true, If set `true` enables dragging of the WriteAway panel
   */
  navBarDraggable: boolean,
  /**
   * Can navbar be collapsed
   */
  navBarCollapsable: boolean,
  /**
   * Start in expect mode
   */
  expert?: boolean,
  /**
   * Starting collapsed state of navbar
   */
  navBarCollapsed?: boolean,
  /**
   * Optional. Default: document.body, Set place for the showing hover overlay
   */
  overlayRoot?: HTMLElement,
  /**
   * Default ajax options
   */
  ajax: Partial<RequestInit>;
  /**
   * API to work with piece items
   */
  api: IPiecesAPI;
  /**
   * Piece options
   */
  piecesOptions: IPiecesOptions;
  /**
   * Initial state
   */
  state?: Partial<IWriteAwayState>;
  /**
   * Start with editors active
   */
  editorActive?: boolean;
  /**
   * Optional meta data that will be attached to pieces during saving
   * to track who and when modified piece
   */
  meta?: Partial<IMeta>;
}

export interface IPieceControllerState {
  byId: { [id: string]: IPieceItem },
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

/**
 * State containing write-away specific data
 */
export interface IWriteAwayStateExtension {
  '@writeaway': IWriteAwayState,
}

/**
 * State containing toastr specific data
 */
export interface IToastrStateExtension {
  toastr: ToastrState,
}

/**
 * Redux state of WriteAway controller
 */
export interface IWriteAwayState {
  config: IOptions,
  global: IGlobalState,
  pieces: IPieceControllerState,
}

/**
 * @private
 */
export type GetIWriteAwayState = () => IWriteAwayStateExtension;

/**
 * Available actions for a piece
 */
export type PieceActions<DataType = any> = {
  /**
   * @deprecated
   */
  onManualActivation: (id: string) => void,
  /**
   * @deprecated
   */
  onManualDeactivation: (id: string) => void,
  /**
   * Update piece in state by id
   */
  updatePiece: (id: string, piece: Partial<IPieceItem<DataType>>) => void,
  /**
   * Rollback piece state to previously saved state
   */
  resetPiece: (id: string) => void,
  /**
   * Save piece state on server
   */
  savePiece: (id: string) => void,
  onEditorActive: (id: string, active: boolean) => void,
  /**
   * Signal node was resized so controller resizes hover rectangle
   */
  onNodeResized: (id: string) => void,
  /**
   * Sets message to display for specific piece in controller bar
   */
  setPieceMessage: (id: string, message: string, messageLevel: string) => void,
  /**
   * Forcefully opens source editor for specified id
   * @deprecated
   */
  setCurrentSourcePieceId: (id: string) => void,
};

export interface IReactActionProps<DataType = any> {
  /**
   * Dynamically add component to support piece type
   */
  attachComponent: (type: PieceType, component: IComponent) => void,
  /**
   * Dynamically add piece
   */
  addPiece: (piece: IPieceItem<DataType>) => void,
  /**
   * Dynamically remove piece
   */
  removePiece: (pieceId: string) => void,
}

export interface IReactPieceProps {
  id: string,
  name: string,
}

/**
 * Props passed to editor component
 */
export interface IPieceProps<DataType = any> {
  /**
   * Properties of piece
   */
  piece: IPieceItem<DataType>;
  /**
   * Actions for piece manipulations
   */
  actions: PieceActions<DataType>;
  /**
   * Boolean indicating expert mode is enabled
   */
  expert: boolean;
  /**
   * Boolean indicating this editor type is active
   */
  editorActive: boolean;
  /**
   * Wrapper where all editors are located
   */
  wrapper: HTMLElement;
  /**
   * @deprecated
   */
  onClose?: () => void;
  /**
   * @deprecated
   */
  onSave?: (id: string) => void;
  /**
   * API for working with pieces
   */
  api: IPiecesAPI;
  /**
   * Options to pass to editor initializator
   */
  options?: any;
  /**
   * Classnames to pass to editor initializator
   */
  className?: string;
}

/**
 * Interface that should be implemented by component that
 */
export interface IComponent<Data = any> extends ComponentClass<IPieceProps<Data>> {
  /**
   * Label that will be displayed in controller nav bar, i.e. "Image Editor"
   */
  label: string,
  /**
   * Label that will be displayed on hover bar, i.e. "Edit Image"
   */
  editLabel: string,
  /**
   * Method that applies data to editor node
   */
  applyEditor: (node: HTMLElement, data: Data) => void,
}

/**
 * Bounding Rectangle for node
 * @private
 */
export interface Rect {
  top: number,
  bottom: number,
  left: number,
  right: number,
  width: number,
  height: number,
}

/**
 * @private
 */
export type Dispatch = ThunkDispatch<IWriteAwayStateExtension & IToastrStateExtension, {}, AnyAction>;

/**
 * @private
 */
export type Action = AnyAction | ThunkAction<any, IWriteAwayStateExtension & IToastrStateExtension, any, any>;

/**
 * @private
 */
export type Store = StoreRaw<IWriteAwayStateExtension & IToastrStateExtension> & { dispatch: Dispatch };

export interface INavBarProps {
  navBarDraggable: boolean,
  navBarCollapsable: boolean,
  pieceNameGroupSeparator: string,
}

/**
 * @private
 */
export interface BarOptions extends INavBarProps {
  navBarRoot: HTMLElement,
}

/**
 * Meta data describing who and when modified particular piece
 */
export interface IMeta {
  id: string,
  label: string,
  time: number,
}
