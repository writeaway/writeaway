import { EditorSourceCode } from '@writeaway/plugin-codemirror';
import { EditorBlockBackground, EditorImage, EditorRichText } from '@writeaway/plugin-medium';
import { EditorSeo } from '@writeaway/plugin-seo';

export const components = {
  html: EditorRichText,
  image: EditorImage,
  background: EditorBlockBackground,
  source: EditorSourceCode,
  seo: EditorSeo,
};
