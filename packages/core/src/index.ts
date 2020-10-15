import { WriteAwayCore as core } from './WriteAwayCore';
import { writeAwayReducers as reducer } from './reducers';
import 'styles/writeaway.less';

export * from './types';

// Includes version and time in bundle
export const version = `Version ${process.env.VERSION}, built at ${process.env.BUILD_TIME}`;

export const WriteAwayCore = core;

export const writeAwayReducers = reducer;

// eslint-disable-next-line import/no-extraneous-dependencies
export { defaultMinimumApi, defaultOptions, defaultPieces } from 'defaults';

export default WriteAwayCore;
