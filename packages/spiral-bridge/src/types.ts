import { RedaxtorSeoData } from '@writeaway/plugin-seo';

export interface IPieceGetRequest {
  id: string;
  data: any;
}

export interface IPieceSaveRequest {
  id: string;
  data: any;
}

export interface Urls {
  deleteImageUrl?: string,
  saveMetaUrl: string,
  imageGalleryUrl: string,
  uploadUrl: string,
  savePieceUrl: string,
  getPieceUrl: string,
}

export interface IMetadataSaveRequest extends RedaxtorSeoData {
  namespace?: string,
  view?: string,
  code?: string,
}
