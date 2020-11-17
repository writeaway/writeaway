import { WriteAwaySeoData } from '@writeaway/plugin-seo';

export interface IPieceGetRequest {
  id: string;
  data: any;
}

export interface IPieceSaveRequest {
  id: string;
  type: string;
  piece?: any;
  data: any;
}

export interface Urls {
  deleteImageUrl?: string,
  saveMetaUrl: string,
  imageGalleryUrl: string,
  uploadUrl: string,
  savePieceUrl: string,
  getPieceUrl: string,
  getPieceBulkUrl?: string,
}

export interface IMetadataSaveRequest extends WriteAwaySeoData {
}
