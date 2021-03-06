/**
 * @packageDocumentation
 * @module WriteAway
 */

import autobind, { boundMethod } from 'autobind-decorator';
import { PieceEditors } from 'containers/PieceEditors';
import {
  defaultMinimumApi, defaultOptions, defaultPieces, defaultState, defaultWrappedState,
// eslint-disable-next-line import/no-extraneous-dependencies
} from 'defaults';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import ReduxToastr from 'react-redux-toastr';
import { AnyAction, applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import {
  IOptions,
  IPiecesOptions,
  IPieceItem,
  IWriteAwayState,
  PieceType,
  IPiecesAPI,
  IPieceControllerState, Dispatch, Store, BarOptions, IWriteAwayStateExtension, IToastrStateExtension, INavBarProps,
} from 'types';
import { REDUCER_KEY } from './constants';
import { piecesToggleNavBar, setExpert } from './actions';
import {
  addPiece,
  deactivatePiece, externalPieceUpdate, hasRemovedPiece,
  pieceGet,
  piecesToggleEdit,
  removePiece,
  setPieceData,
} from './actions/pieces';
import HoverOverlay from './containers/HoverOverlayContainer';
import WriteAwayContainer from './containers/WriteAwayContainer';
import { configureFetch } from './helpers/callFetch';
import reducers from './reducers';

export class WriteAwayCore {
  private readonly options: IOptions;

  private store!: Store;

  private overlayNode?: HTMLElement;

  private barNode?: HTMLElement;

  private unsubscribe?: () => void;

  constructor(options: Partial<IOptions> = {}) {
    this.options = {
      ...defaultOptions,
      ...options,
    };

    /** More complex merges */
    if (options.piecesOptions) {
      this.options.piecesOptions = {
        ...defaultPieces,
        ...options.piecesOptions,
        components: { ...this.options.piecesOptions.components, ...options.piecesOptions.components },
      };
    }
    this.options.api = { ...defaultMinimumApi, ...options.api };

    /**
     * Checks
     */
    if (!this.options.piecesOptions) {
      throw new Error('pieces config is mandatory');
    }

    this.initStore();
    this.initInstance();
    this.start();
  }

  private initStore() {
    /**
     * Init state
     */
    const editorEnabled: Partial<Record<PieceType, boolean | undefined>> = {};
    Object.keys(this.options.piecesOptions.components).forEach((key) => {
      editorEnabled[key as PieceType] = true;
    });
    const piecesState: IPieceControllerState = { ...defaultState.pieces, editorEnabled };
    const state: IWriteAwayState = {
      ...defaultState,
      pieces: piecesState,
      ...this.options.state,
      config: this.options,
    };
    const composeEnhancers = composeWithDevTools({
      name: 'WriteAway',
      serialize: {
        // eslint-disable-next-line consistent-return
        replacer: (key: string, value: any) => {
          if (value instanceof HTMLElement) { // use your custom data type checker
            return `HTMLElement:${value.tagName}`;
          }
          if (value && value.prototype && value.prototype.isReactComponent) { // use your custom data type checker
            return `IComponent:${(value as any).label}`;
          }
          return value;
        },
      } as any,
    });

    this.store = createStore<IWriteAwayStateExtension & IToastrStateExtension, AnyAction, { dispatch: Dispatch }, {}>(
      reducers,
      {
        ...defaultWrappedState,
        [REDUCER_KEY]: state,
      },
      composeEnhancers(
        applyMiddleware(thunk as ThunkMiddleware),
        // other store enhancers if any
      ),
    );
  }

  private initInstance() {
    /**
     * Push to singletons
     */
    if (this.options.ajax) configureFetch(this.options.ajax);
  }

  private start() {
    const { options } = this;
    /**
     * options.piecesRoot - say where search for pieces
     */
    this.initPieces(this.options.piecesRoot || document);
    this.renderPieceEditors(this.options.editorRoot || document);

    /**
     * default options for navbar
     */
    const barOptions: BarOptions = {
      navBarRoot: options.navBarRoot || document.body,
      navBarDraggable: (options.navBarDraggable !== undefined && options.navBarDraggable !== null) ? options.navBarDraggable : true,
      navBarCollapsable: (options.navBarCollapsable !== undefined && options.navBarCollapsable !== null) ? options.navBarCollapsable : true,
      pieceNameGroupSeparator: options.piecesOptions.nameGroupSeparator,
    };
    this.setNavBarCollapsed(options.navBarCollapsed ?? false);
    this.showBar(barOptions);
    /**
     * options.overlayRoot - say where search for pieces
     */
    this.showHoverOverlay(options.overlayRoot || document.body);

    /**
     * Enable pieces editing if set option 'editorActive'
     */
    if (this.options.editorActive) {
      this.store.dispatch(piecesToggleEdit());
    }

    document.addEventListener('keyup', this.handleKeyUp);

    if (options.api.subscribe) {
      this.unsubscribe = options.api.subscribe(this.handleRealTimeUpdate);
    }
  }

  @autobind
  private handleRealTimeUpdate(piece: Partial<IPieceItem>) {
    this.store.dispatch(externalPieceUpdate(piece));
    return true;
  }

  destroy() {
    document.removeEventListener('keyup', this.handleKeyUp);
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  get api(): IPiecesAPI {
    return this.config.api;
  }

  get piecesConfig(): IPiecesOptions {
    return this.config.piecesOptions;
  }

  get state(): IWriteAwayState {
    return this.store.getState()[REDUCER_KEY as '@writeaway'];
  }

  get pieces() {
    return this.state.pieces;
  }

  get config(): IOptions {
    return this.state.config;
  }

  @boundMethod
  private handleKeyUp(event: KeyboardEvent) {
    switch (event.code) {
      case 'Escape': // is escape
        this.onEscPress();
        break;
      default:
        break;
    }
  }

  private onEscPress() {
    const { state } = this;
    if (state.pieces.activeIds && state.pieces.activeIds.length > 0) {
      this.store.dispatch(deactivatePiece(state.pieces.activeIds[0]));
    } else {
      this.setEditorActive(false);
    }
  }

  /**
   * Renders a top WriteAway bar with controls and attach it to body
   */
  private showBar(options: BarOptions) {
    this.barNode = document.createElement('DIV');
    this.barNode.classList.add('writeaway-navbar');
    ReactDOM.render(
      <Provider store={this.store}>
        <div>
          <WriteAwayContainer
            options={options as INavBarProps}
          />
          <ReduxToastr
            className="r_toast-container"
            timeOut={4000}
            position="top-right"
          />
        </div>
      </Provider>,
      this.barNode,
    );
    options.navBarRoot.appendChild(this.barNode);
  }

  /**
   * Renders tbe hover overlay
   */
  private showHoverOverlay(root: HTMLElement) {
    this.overlayNode = document.createElement('div');
    ReactDOM.render(
      <Provider store={this.store}>
        <HoverOverlay showPieceUpdates />
      </Provider>,
      this.overlayNode,
    );
    root.appendChild(this.overlayNode);
  }

  private initPieces(contextNode: HTMLElement) {
    if (this.options.piecesOptions.selector) {
      const nodes = contextNode.querySelectorAll(this.options.piecesOptions.selector);
      for (let i = 0; i < nodes.length; i += 1) {
        this.addPiece(nodes[i] as HTMLElement);
      }
    }
  }

  /**
   * Add a piece from specific node
   * @param node HTMLElement
   * @param options {WriteAwayPieceOptions}
   * @param options.id {string} Mandatory unique identification id of piece. Should present in options OR in
   `this.options.pieces.attributeId` attribute of node, i.e. `data-id`
   * @param options.type {string} Mandatory type of piece. Should present in options OR in
   `this.options.pieces.attribute` attribute of node, i.e. `data-piece`
   * @param options.name {string} Optional. Human readable name for list in editor. If not specified will be
   tried to be read from `this.options.pieces.attributeName` attribute of node
   * @param options.dataset {Object} Optional. Set of random data attributes associated with node that will
   be passed to save and get API calls. If not specified will be read directly from node dataset.
   * @param options.data {Object} Optional. Set of data associated with piece in format of piece component.
   If not specified will be fetched.
   */
  addPiece<Data = any>(node: HTMLElement, options: { id?: string, name?: string, type?: string, data?: Data, dataset?: { [k: string]: string } } = {}) {
    const piece: IPieceItem<Data> = {
      node,
      type: ((options && options.type) || node.getAttribute(this.options.piecesOptions.attribute)) as PieceType,
      id: ((options && options.id) || node.getAttribute(this.options.piecesOptions.attributeId)) as string,
      name: ((options && options.name) || node.getAttribute(this.options.piecesOptions.attributeName)) as string,
      changed: false,
      message: '',
      messageLevel: '',
      dataset: { ...options.dataset, ...(node.dataset as any) },
      data: options.data,
    };
    if (!piece.id) throw new Error('Can\'t add piece with undefined id');
    if (!piece.type) throw new Error('Can\'t add piece with undefined type');
    if (!this.options.piecesOptions.components[piece.type as PieceType]) throw new Error(`Can't add piece with unsupported type "${piece.type}"`);

    this.store.dispatch(addPiece(piece));
    this.store.dispatch(pieceGet(piece.id));
  }

  /**
   * Prepares node for removal from DOM. Dirty destroys editor. Removes listeners, cleans up memory, but does
   not restore node fully.
   * @param id of element to destroy
   */
  destroyPiece(id: string) {
    this.store.dispatch(removePiece(id));// TODO: Might be deprecated
    // this.store.dispatch(pieceUnmount(this.state.pieces.byId[id])); // Remove element from dom and trigger removing from state
    this.store.dispatch(hasRemovedPiece(id));// Trigger removing from state that will trigger dom removal as well
  }

  /**
   * Set new data to a piece by piece id
   * @param pieceId {string} id of piece
   * @param data {Data} `data` of the pieces
   */
  setData<Data>(pieceId: string, data: Data) {
    const { pieces } = this;
    const currentPiece = pieces && pieces.byId && pieces.byId[pieceId];
    if (!currentPiece) {
      throw new Error(`You are trying to set data to an unexisting piece. Piece id: ${pieceId}`);
    }
    if (!currentPiece.fetched) {
      throw new Error(`Piece was not initialized before use setDate function. Piece id: ${pieceId}`);
    }
    this.store.dispatch(setPieceData(pieceId, data));
  }

  /**
   * Checks if editor toggle is active
   * @param editorType {PieceType} editor type. Optional. If not specified, returns state of "all" toggle
   * @returns {boolean}
   */
  isEditorActive(editorType?: PieceType) {
    const { pieces } = this;

    if (editorType) {
      return pieces.editorEnabled[editorType] ?? false;
    }
    return pieces.editorActive ?? false;
  }

  /**
   * Get a list of all active pieces information
   * @returns {{ [pieceId: string]: IPieceItem}}
   */
  getPieceList() {
    const piecesState = this.pieces;
    const pieces = (piecesState && piecesState.byId) || {};
    const out: Record<string, IPieceItem> = {};
    Object.keys(pieces).forEach((pieceId) => {
      out[pieceId] = { // Clone piece, so outer code can't affect it
        ...pieces[pieceId],
        data: pieces[pieceId].data ? { ...pieces[pieceId].data } : undefined,
      } as IPieceItem;
    });
    return out as { [pieceId: string]: IPieceItem};
  }

  /**
   * Destroy all existing pieces
   */
  destroyAllPieces() {
    const piecesState = this.pieces;
    const pieces = (piecesState && piecesState.byId) || {};
    Object.keys(pieces).forEach((pieceId: string) => this.destroyPiece(pieceId));
  }

  /**
   * Check if navbar is collapsed
   * @returns {boolean}
   */
  isNavBarCollapsed() {
    return this.state.global.navBarCollapsed ?? true;
  }

  /**
   * Check if expert mode
   * @returns {boolean}
   */
  isExpertMode() {
    return this.state.global.expert ?? false;
  }

  /**
   * Set the active state for editors
   * @param editorActive {boolean} new state
   * @param editorType {PieceType} type of editor, optional. By default applies to "all" toggle.
   */
  setEditorActive(editorActive: boolean, editorType?: PieceType) {
    const isActiveNow = this.isEditorActive(editorType);
    if (editorActive !== isActiveNow) {
      this.store.dispatch(piecesToggleEdit(editorType));
    }
  }

  /**
   * Set the collapsed state for navbar
   * @param navBarActive {boolean} new state
   */
  setNavBarCollapsed(navBarActive: boolean) {
    const isCollapseNow = this.isNavBarCollapsed();
    if (navBarActive !== isCollapseNow) {
      this.store.dispatch(piecesToggleNavBar());
    }
  }

  /**
   * Visualize expert features
   * @param expert {boolean} new state
   */
  setExpertMode(expert: boolean) {
    this.store.dispatch(setExpert(!!expert));
  }

  applyEditor(node: HTMLElement, editorType: PieceType, data: any) {
    const componentObj = this.options.piecesOptions.components[editorType];
    if (componentObj) {
      if (componentObj.applyEditor && data) {
        componentObj.applyEditor(node, data);
      }
    } else {
      throw new Error(`Unknown editor type '${editorType}'`);
    }
  }

  private renderPieceEditors(container: HTMLElement) {
    const div = document.createElement('div');
    div.classList.add('writeaway-editors');
    container.appendChild(div);
    ReactDOM.render(
      <Provider store={this.store}>
        <PieceEditors />
      </Provider>,
      div,
    );
  }
}

export default WriteAwayCore;
