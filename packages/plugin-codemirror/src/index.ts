import type { IComponent } from '@writeaway/core';
import { RedaxtorCodeMirrorData } from 'types';
import { WriteAwayReactCode as ReactCode } from './WriteAwayRectCode';
import RedaxtorCodemirror from './RedaxtorCodemirror';

export * from './types';

// Includes version and time in bundle
export const version = `Version ${process.env.VERSION}, built at ${process.env.BUILD_TIME}`;

export const WriteAwayCodeMirror: IComponent<RedaxtorCodeMirrorData> = RedaxtorCodemirror;

export const WriteAwayReactCode = ReactCode;

export default WriteAwayCodeMirror;
