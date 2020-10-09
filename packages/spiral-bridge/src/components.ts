import { WriteAwayCodeMirror } from '@writeaway/plugin-codemirror';
import { WriteAwayBackground, WriteAwayImageTag, WriteAwayMedium } from '@writeaway/plugin-medium';
import { WriteAwaySeo } from '@writeaway/plugin-seo';

export const components = {
  html: WriteAwayMedium,
  image: WriteAwayImageTag,
  background: WriteAwayBackground,
  source: WriteAwayCodeMirror,
  seo: WriteAwaySeo,
};
