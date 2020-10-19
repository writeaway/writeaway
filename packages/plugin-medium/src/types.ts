export type WriteAwayImageTagData = { src?: string, title?: string, alt?: string};
export type WriteAwayImageTagDimensionData = { width?: number, height?: number, originalWidth?: number, originalHeight?: number};
export type WriteAwayImageTagBGData = { bgColor?: string, bgRepeat?: string, bgPosition?: string, bgSize?: string };
export type WriteAwayImageData = WriteAwayImageTagData & WriteAwayImageTagDimensionData & WriteAwayImageTagBGData;
