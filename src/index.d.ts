declare module "redaxtor" {
    import * as React from 'react';

    export interface RedaxtorOptions {
        pieces: {
            components?: { [componentType: string]: React.Component<any, any>; }
        };

        api: {
            getImageList?: () => Promise<string[]>,
            uploadImage?: (image: FormData) => any,
            getPieceData?: (piece: RedaxtorPiece) => Promise<any>,
            savePieceData?: (piece: RedaxtorPiece) => Promise<void>
        };

        piecesRoot?: HTMLElement;
        enableEdit?: boolean;
        navBarRoot?: HTMLElement;
        navBarDraggable?: boolean;
        navBarCollapsable?: boolean;
    }

    export interface RedaxtorPiece {
        id: string;
        type: string;
        data: any;
        dataset: any;
    }

    export interface RedaxtorPieceOptions {
        id: string;
        type: string;
        data?: any;
    }

    export default class Redaxtor {
        constructor(options: RedaxtorOptions);
        addPiece(node: HTMLElement, options: RedaxtorPieceOptions): void;
        setData(id: string, data: any): void;
        destroyPiece(id: string): void;
        isEditorActive(): boolean;
        isNavBarCollapsed(): boolean;
        setEditorActive(editorName: string, editorActive: boolean): void;
        setNavBarCollapsed(navBarActive: boolean): void;

        static defaultMinimumApi: any;
    }
}