export type PieceDataResolver<DataType = any> = (piece: IPiece<DataType>) => Promise<IPieceWithData<DataType>>;

export interface RedaxtorAPI {
  getImageList?: () => unknown,
  uploadImage?: () => unknown,
  isNodeVisible: (piece: unknown) => boolean,
  getPieceData: PieceDataResolver,
  savePieceData: (piece: IPieceWithData) => Promise<unknown>,
  resolvers: Record<PieceType, PieceDataResolver>
}

export type PieceType = 'source' | 'background' | 'html' | 'image';

export interface IPiece<DataType = any> {
  node: HTMLElement;
  type: PieceType;
  data?: DataType;
}

export interface IPieceState<DataType = any> extends IPiece<DataType> {
  id: string,
  name: string,
  messageLevel: string,
  message: string,
  changed: boolean,
}

export interface IPieceWithData<DataType = any> extends IPiece<DataType> {
  data: DataType;
}

export interface IWriteAwayState {
  global: {
    navBarCollapsed: boolean,
    expert: boolean,
  },
  pieces: {
    byId: { [id: string]: IPiece },
    editorActive: boolean,
    activeIds?: string[],
    hoveredId?: string,
    hoveredRect?: Rect,
    editorEnabled: Partial<Record<PieceType, boolean | undefined>>,
  }
}

export type IComponent = {
  name: string,
  editLabel: string,
}

export interface Rect {
  top: number,
  bottom: number,
  left: number,
  right: number,
}
