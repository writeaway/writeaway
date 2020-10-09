import { IComponent } from '@writeaway/core';
import { RedaxtorImageData } from 'types';
import RedaxtorMedium from './RedaxtorMedium';
import ImageTag from './ImageTagEditor';
import BackgroundImageEditor from './BackgroundImageEditor';

import 'redaxtor-medium.less';

export const WriteAwayImageTag: IComponent<RedaxtorImageData> = ImageTag;
export const WriteAwayBackground: IComponent<RedaxtorImageData> = BackgroundImageEditor;
export const WriteAwayMedium: IComponent<{ html: string }> = RedaxtorMedium;

export * from './types';

// Includes version and time in bundle
export const version = `Version ${process.env.VERSION}, built at ${process.env.BUILD_TIME}`;

export default {
  HTMLEditor: RedaxtorMedium,
  IMGTagEditor: ImageTag,
  BackgroundImageEditor,
};
