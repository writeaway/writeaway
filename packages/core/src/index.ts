import { WriteAwayCore as core } from './WriteAwayCore';
import 'styles/redaxtor.less';

export * from './types';

// Includes version and time in bundle
export const version = `Version ${process.env.VERSION}, built at ${process.env.BUILD_TIME}`;

export const WriteAwayCore = core;

export { defaultMinimumApi, defaultOptions, defaultPieces } from 'defaults';

export default WriteAwayCore;
