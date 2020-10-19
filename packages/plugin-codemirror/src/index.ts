import type { IComponent } from '@writeaway/core';
import { WriteAwayCodeMirrorData } from 'types';
import { WriteAwayReactCode as ReactCode } from './WriteAwayRectCode';
import WriteAwayCodemirror from './WriteAwayCodemirror';

export * from './types';

// Includes version and time in bundle
export const version = `Version ${process.env.VERSION}, built at ${process.env.BUILD_TIME}`;

export const WriteAwayCodeMirror: IComponent<WriteAwayCodeMirrorData> = WriteAwayCodemirror;

export const WriteAwayReactCode = ReactCode;

export default WriteAwayCodeMirror;
