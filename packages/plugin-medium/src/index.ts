import RedaxtorMedium from './RedaxtorMedium';
import ImageTag from './ImageTagEditor';
import BackgroundImageEditor from './BackgroundImageEditor';

export const WriteAwayImageTag = ImageTag;
export const WriteAwayBackground = BackgroundImageEditor;
export const WriteAwayMedium = RedaxtorMedium;

export * from './types';

// Includes version and time in bundle
export const version = `Version ${process.env.VERSION}, built at ${process.env.BUILD_TIME}`;

export default {
  HTMLEditor: RedaxtorMedium,
  IMGTagEditor: ImageTag,
  BackgroundImageEditor,
};
