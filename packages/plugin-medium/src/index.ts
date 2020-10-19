import { IComponent } from '@writeaway/core';
import { WriteAwayImageData } from 'types';
import WriteAwayMediumEditor from './WriteAwayMedium';
import ImageTag from './ImageTagEditor';
import BackgroundImageEditor from './BackgroundImageEditor';

import 'writeaway-medium.less';

export const WriteAwayImageTag: IComponent<WriteAwayImageData> = ImageTag;
export const WriteAwayBackground: IComponent<WriteAwayImageData> = BackgroundImageEditor;
export const WriteAwayMedium: IComponent<{ html: string }> = WriteAwayMediumEditor;

export * from './types';

// Includes version and time in bundle
export const version = `Version ${process.env.VERSION}, built at ${process.env.BUILD_TIME}`;

export default {
  WriteAwayImageTag,
  WriteAwayMedium,
  WriteAwayBackground,
};
