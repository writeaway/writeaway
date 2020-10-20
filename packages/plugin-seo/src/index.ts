import { IComponent } from '@writeaway/core';
import { WriteAwaySeoData } from 'types';
import { WriteAwaySeo as Editor } from './WriteAwaySeo';
import { WriteAwayReactSEO } from './ReactPieceSeo';

import 'google-preview.less';

export * from 'types';

export const EditorSeo: IComponent<WriteAwaySeoData> = Editor;

export const ReactPieceSeo = WriteAwayReactSEO;

export default EditorSeo;
