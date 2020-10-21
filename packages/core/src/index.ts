import { externalPieceUpdate } from 'actions/pieces';
import { setAPI, setMeta } from 'actions/index';
import connectActions from 'containers/connectActions';
import { PieceEditors } from 'containers/PieceEditors';
import NavBar from 'containers/WriteAwayContainer';
import HoverOverlay from 'containers/HoverOverlayContainer';
import { REDUCER_KEY } from './constants';
import { WriteAwayCore as core } from './WriteAwayCore';
import { writeAwayReducers } from './reducers';
import 'styles/writeaway.less';

export * from './types';

/**
 * React components and helpers
 * */
export const reducer = writeAwayReducers;

export const reducerKey = REDUCER_KEY;

export const WriteAwayNavBar = NavBar;

export const WriteAwayOverlay = HoverOverlay;

export const WriteAwayEditors = PieceEditors;

export const connectDynamicActions = connectActions;

export const externalPieceUpdateAction = externalPieceUpdate;

export const setAPIAction = setAPI;

export const setMetaAction = setMeta;

/**
 * Defaults
 */

export {
  defaultMinimumApi,
  defaultOptions,
  defaultPieces,
  defaultState,
} from './defaults';

/**
 * Classic app exports
 */

// Includes version and time in bundle
export const version = `Version ${process.env.VERSION}, built at ${process.env.BUILD_TIME}`;

export const WriteAwayCore = core;

export default WriteAwayCore;
