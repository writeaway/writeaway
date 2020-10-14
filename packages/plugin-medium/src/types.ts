export type RedaxtorImageTagData = { src?: string, title?: string, alt?: string};
export type RedaxtorImageTagDimensionData = { width?: number, height?: number, originalWidth?: number, originalHeight?: number};
export type RedaxtorImageTagBGData = { bgColor?: string, bgRepeat?: string, bgPosition?: string, bgSize?: string };
export type RedaxtorImageData = RedaxtorImageTagData & RedaxtorImageTagDimensionData & RedaxtorImageTagBGData;
