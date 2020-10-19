import connectActions from 'containers/connectActions';
import NavBar from 'containers/RedaxtorContainer';
import HoverOverlay from 'containers/HoverOverlayContainer';
import { REDUCER_KEY } from './constants';
import { WriteAwayCore as core } from './WriteAwayCore';
import { writeAwayReducers } from './reducers';
import 'styles/writeaway.less';

export * from './types';

// Includes version and time in bundle
export const version = `Version ${process.env.VERSION}, built at ${process.env.BUILD_TIME}`;

export const WriteAwayCore = core;

export const reducer = writeAwayReducers;

export const reducerKey = REDUCER_KEY;

export const WriteAwayNavBar = NavBar;

export const WriteAwayOverlay = HoverOverlay;

export const connectDynamicActions = connectActions;

export {
  defaultMinimumApi,
  defaultOptions,
  defaultPieces,
  defaultState,
} from './defaults';

export default WriteAwayCore;
