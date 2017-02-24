/**
 * Redaxtor main module including Redaxtor main class and basic module interface information
 */
declare module redaxtor {

    /**
     * Redaxtor resource object stores data of a single image from server
     */
    export interface IRedaxtorResource {
        /**
         * URL of image
         */
        url: string;
        /**
         * Thumbnail URL
         */
        thumbnailUrl?: string;

        /**
         * Server-side calculated width
         */
        width?: number;

        /**
         * Server-side calculated height
         */
        height?: number;
    }

    /**
     * API that redaxtor uses to fetch and save data from external sources
     */
    export interface IRedaxtorAPI {
        /**
         * Fetches resource list associated with a piece
         * If not specified, piece is considered to be resource-less
         * @param piece {IRedaxtorPiece}
         */
        getImageList?: (piece: IRedaxtorPiece) => Promise<IRedaxtorResource[]>;

        /**
         * Upload resource to server
         * If not specified, piece is considered not to be able to add server resources
         * @param data {FormData} prefilled by component form data component
         * @param piece {IRedaxtorPiece}
         */
        uploadImage?: (data: FormData, piece: IRedaxtorPiece) => Promise<IRedaxtorResource>;

        /**
         * Fetch piece data and return new piece object with {@link RedaxtorPiece.data} filled
         * @param piece
         */
        getPieceData?: (piece: IRedaxtorPiece) => Promise<IRedaxtorPiece>;

        /**
         * Save piece data
         * @param piece
         */
        savePieceData?: (piece: IRedaxtorPiece) => Promise<void>
    }

    /**
     * Redaxtor constructor options
     */
    export interface IRedaxtorOptions {

        /**
         * List of available editor components for pieces
         * See {@link RedaxtorComponent} and its props {@link IRedaxtorComponentProps}
         */
        pieces: {
            components?: { [componentType: string]: RedaxtorComponent; }
        };

        /**
         * External API to fetch and save data for pieces
         */
        api: IRedaxtorAPI;

        /**
         * HTMLElement root of pieces container. Specify detached from document element to disable auto-search
         * @default document.body
         */
        piecesRoot?: HTMLElement;

        /**
         * Start editor started
         * @default false
         */
        editorActive?: boolean;

        /**
         * Element to attach redaxtor navigation panel
         * @default document.body
         */
        navBarRoot?: HTMLElement;

        /**
         * Allow dragging of navigation panel
         * @default true
         */
        navBarDraggable?: boolean;

        /**
         * Allow user collapsing of navigation panel
         * @default true
         */
        navBarCollapsable?: boolean;

        /**
         * A string used as a group separator in redaxtor piece names
         * @default undefined
         */
        pieceNameGroupSeparator?: string;
    }

    export interface IRedaxtorPiece {
        /**
         * Unique piece id
         */
        id: string;

        /**
         * Piece type is a string representing a type of component to use to edit this piece
         * It should match one of the {@link IRedaxtorOptions.components} map keys
         */
        type: string;

        /**
         * Optional human readable piece name
         */
        name?: string;

        /**
         * Node that piece is editing
         */
        node: HTMLElement;

        /**
         * Data of piece editor component {@link IRedaxtorOptions.components}
         * Each component may have own format of data, typically it has functionally minimum set of attributes editable by component
         */
        data: any;

        /**
         * Readonly random data associated with a piece that is not edited by component editors,
         * but may be used for additional identifications in external API calls
         * Typically that stores all dataset attributes of html node
         * @readonly
         * @const
         */
        dataset: {[dataAttribute: string]: string};

        /**
         * Indicates if piece was changed and not saved yet with {@link IRedaxtorAPI.savePieceData}
         * @private
         */
        changed: boolean;

        /**
         * Indicates that piece was fetched from API call {@link IRedaxtorAPI.getPieceData}
         * @private
         */
        fetched: boolean;

        /**
         * Indicates that piece editor is active
         * @private
         */
        active: boolean;

        /**
         * Indicates that piece is in process of fetching from API call {@link IRedaxtorAPI.getPieceData}
         * @private
         */
        fetching: boolean;

        /**
         * Message that states important notification information for user.
         * Typically a server save error or notification that changes will be applied on reload only
         * @private
         */
        message?: string;

        /**
         * Message type, error or warning
         * @private
         */
        messageLevel?: "error" | "warning";

        /**
         * Flag is raised to manually activate node editor with prop.
         * Editor component is expected to drop it using onManualActivation {@link IRedaxtorComponentProps.onManualActivation}
         * @private
         */
        manualActivation: boolean
    }

    export interface IRedaxtorPieceOptions {
        /**
         * Specify unique piece id for {@link IRedaxtorPiece.id}
         */
        id: string;

        /**
         * Piece type is a string representing a type of component to use to edit this piece
         * It should match one of the {@link IRedaxtorOptions.components} map keys
         */
            type: string;

        /**
         * Specify human readable name for {@link IRedaxtorPiece.name}
         */
        name?: string;

        /**
         * Specify data {@link RedaxtorPiece.data}
         * If data is not specified, adding a piece will make an {@link IRedaxtorOptions.api.getPieceData} call to retrieve it
         */
        data?: any;

        /**
         * Readonly random data associated with a piece that is not edited by component editors,
         * but may be used for additional identifications in external API calls {@link IRedaxtorPiece.dataset}
         * If not specified, stores all dataset attributes of html node
         * @readonly
         */
        dataset: {[dataAttribute: string]: string};
    }

    export default class Redaxtor {
        constructor(options: IRedaxtorOptions);

        addPiece(node: HTMLElement, options: IRedaxtorPieceOptions): void;

        /**
         * Set new data to a piece by piece id
         * @param pieceId {string} id of piece
         * @param data {Object} new data
         */
        setData(pieceId: string, data: any): void;

        /**
         * Prepares node for removal from DOM. Dirty destroys editor. Removes listeners, cleans up memory, but does not restore node fully.
         * @param id {string} Piece id of element to destroy
         */
        destroyPiece(id: string): void;

        /**
         * Checks if editor toggle is active
         * @param editorType {string} editor type. Optional. If not specified, returns state of "all" toggle
         * @returns {boolean}
         */
        isEditorActive(editorType?: string): boolean;

        /**
         * Check if navbar is collapsed
         * @returns {boolean}
         */
        isNavBarCollapsed(): boolean;

        /**
         * Set the active state for editors
         * @param editorActive {boolean} new state
         * @param editorType {string} type of editor, optional. By default applies to "all" toggle.
         */
        setEditorActive(editorActive: boolean, editorType?: string): void;

        /**
         * Set the collapsed state for navbar
         * @param navBarActive {boolean} new state
         */
        setNavBarCollapsed(navBarActive: boolean): void;

        /**
         * Redaxtor has default implementation for specific use case scenario when you have component mapping as default one with default Redaxtor components
         */
        static defaultMinimumApi: IRedaxtorAPI;
    }

    export interface IRedaxtorComponentProps extends /* React.ClassAttributes<RedaxtorComponent>, */ IRedaxtorPiece {


        /**
         * @deprecated
         */
        highlight: boolean;

        /**
         * Editor type for node is active
         */
        editorActive: boolean;

        /**
         * Call this function after you've initiated changes triggered by manualActivation flag.  {@link IRedaxtorPiece.manualActivation}
         * @param id
         */
        onManualActivation: (id: string) => any;

        /**
         * Call this to update data of piece
         * @param id {string} piece id
         * @param piece {IRedaxtorPiece}
         */
        updatePiece: (id: string, piece: IRedaxtorPiece) => any;

        /**
         * @deprecated
         */
        resetPiece: (id: string) => any;

        /**
         * Initiate server saving of piece data
         * @param id {string} piece id
         */
        savePiece: (id: string) => any;

        /**
         * Notify if editor is active. This will lock piece from loosing focus easily.
         * @param id {string} piece id
         * @param active {boolean} if piece editor activated
         */
        onEditorActive: (id: string, active: boolean) => any;

        /**
         * Notify that node size has changes. This will trigger rerender of floating pointer block
         * @param id {string} piece id
         */
        onNodeResized: (id: string) => any;

        /**
         * Set notification to user
         * @param id {string} piece id
         * @param message {string}
         * @param messageLevel {string} can be either "error" or "warning"
         */
        setPieceMessage: (id: string, message: string, messageLevel: "error"|"warning") => any;

        /**
         * If your piece supports "source code" editing, call this to initiate source code editor on `piece.data.html` string
         * @param id {string} piece id
         * @private
         */
        setCurrentSourcePieceId: (id: string) => any;
    }

    /**
     * React component that implements a plugin to redaxtor
     * Follows {@link IRedaxtorComponentProps} for props
     * Is of React.Component<IRedaxtorComponentProps, any> type
     */
    export class RedaxtorComponent /* extends React.Component<IRedaxtorComponentProps, any>*/ {
        /**
         * Human readable name of editor component
         */
        static __name: string;
    }
}
