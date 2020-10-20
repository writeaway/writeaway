import { IComponent } from '@writeaway/core';
import { WriteAwayImageData } from 'types';
import WriteAwayMediumEditor from './WriteAwayMedium';
import ImageTag from './ImageTagEditor';
import BackgroundImageEditor from './BackgroundImageEditor';
import { BlockBackgroundReact } from './BlockBackgroundReact';
import { ImageReact } from './ImageReact';
import { RichTextReact } from './RichTextRect';

import 'writeaway-medium.less';

export const EditorImage: IComponent<WriteAwayImageData> = ImageTag;
export const EditorBlockBackground: IComponent<WriteAwayImageData> = BackgroundImageEditor;
export const EditorRichText: IComponent<{ html: string }> = WriteAwayMediumEditor;

export const ReactPieceBlockBackground = BlockBackgroundReact;
export const ReactPieceImage = ImageReact;
export const ReactPieceRichText = RichTextReact;

export * from './types';

// Includes version and time in bundle
export const version = `Version ${process.env.VERSION}, built at ${process.env.BUILD_TIME}`;

export default {
  EditorImage,
  EditorBlockBackground,
  EditorRichText,
};
