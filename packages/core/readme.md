# WriteAway
WriteAway is a JavaScript library for editing CMS pieces inline on pages on the client side.

Based on [React](https://facebook.github.io/react/) and [Redux](https://redux.js.org/)

Created by [SpiralScout](https://spiralscout.com).

WriteAway comes like a core controller with set of plugins for different types of media.

[@writeaway/core](https://github.com/writeaway/writeaway/blob/master/packages/core) - Core controller for all plugins, includes editor floating bar and manages state of editors

[@writeaway/plugin-medium](https://github.com/writeaway/writeaway/blob/master/packages/plugin-medium) - Plugin for supporting rich text editing, editing images and block backgrounds

[@writeaway/plugin-coremirror](https://github.com/writeaway/writeaway/blob/master/packages/plugin-codemirror) - Plugin for editing block's source code, i.e. for embedded iframes or scrips

[@writeaway/plugin-seo](https://github.com/writeaway/writeaway/blob/master/packages/plugin-seo) - Plugin for editing SEO meta tags

## Installation On Top Of Existing Project

To use on top of existing project you would need to create a custom bundle using your favorite packaging tool. You can see 2 samples of such bundles [on demo website](https://github.com/writeaway/writeaway/blob/master/packages/bundle) and in [spiral framework bridge](https://github.com/writeaway/writeaway/blob/master/packages/spiral-bridge)

This bundle will scan an existing page for specific selectors and will attach editors on them

```
npm install --save @writeaway/core
npm install --save @writeaway/plugin-medium
npm install --save @writeaway/plugin-codemirror
npm install --save @writeaway/plugin-seo
```

And then in code of bundle

```typescript
    import { WriteAwayCore } from '@writeaway/core';
    import { WriteAwaySeo } from '@writeaway/plugin-seo';
    import { WriteAwayCodeMirror } from '@writeaway/plugin-codemirror';
    import { WriteAwayBackground, WriteAwayImageTag, WriteAwayMedium } from '@writeaway/plugin-medium';
    
    // Define which piece type is handled by which editor
    const components = {
      html: WriteAwayMedium,
      image: WriteAwayImageTag,
      background: WriteAwayBackground,
      source: WriteAwayCodeMirror,
      seo: WriteAwaySeo,
    };
    
    const writeaway = new WriteAwayCore({
      piecesOptions: {
        selector: '.js-piece', // Selector to look for
        attribute: 'data-type', // Attribute containing piece type, that will define what editor to attach
        attributeId: 'data-id', // Attribute containing unique piece id
        attributeName: 'data-name', // Attribute containing human readable piece name that will be shown as header in hover block
        components,
      },
    });
```

Attach resulting bundle in bottom of the page

For styling you can either write own styles or include default to bundle `.less` file like so

```less
@import "~@writeaway/core/src/styles/writeaway";
@import "~@writeaway/plugin-medium/src/medium-editor";
@import "~@writeaway/plugin-medium/src/writeaway-medium";
@import "~@writeaway/plugin-seo/src/google-preview";
@import "~@writeaway/plugin-seo/src/styles";
```

Alternatively, include compiled CSS files

```less
@import "~@writeaway/core/dist/css/core.css";
@import "~@writeaway/plugin-medium/dist/css/plugin-medium.css";
@import "~@writeaway/plugin-seo/dist/css/plugin-seo.css";
```

## Integrating in React application

### Setup Store

WriteAway uses `redux` and `redux-thunk` middleware so you need to add `redux` provider on top level of your application

```typescript jsx
  import {
    defaultState as writeAwayState,
    reducerKey as writeAwayReducerKey,
    reducer as writeAwayReducer,
    IWriteAwayState
  } from '@writeaway/core';

  /**
   * Configure reducers
   */
  const reducers = combineReducers({
    // Required: Add WriteAway reducer
    [writeAwayReducerKey as '@writeaway']: writeAwayReducer as Reducer<IWriteAwayState>,
    // Options: Add toastr reducer if you use react-redux-toastr. If not, handle react-redux-toastr actions manually in your app to show toasts from WriteAway.  
    toastr, 
    // Add any other application specific reducers
    app: appReducer,
  });

  const defaultAppState = {};

  /**
   * Configure initial default state
   */
  const initialState: IApplicationState = {
    [writeAwayReducerKey]: writeAwayState as IWriteAwayState,
    toastr: undefined as any,
    app: defaultAppState,
  };

  // Compose middlewares
  const middlewares = [
    // WriteAway relies on thunk middleware
    thunk as ThunkMiddleware,
    // Add other middlewares if you need them 
    // sagaMiddleware, 
    // routerMiddleware(history)
  ];

  const enhancers = [applyMiddleware(...middlewares)];
  const store = createStore<IApplicationState, AnyAction, {}, unknown>(
    reducers as any,
    initialState,
    composeWithDevTools({
      name: 'WriteAway React Demo',
      serialize: {
        // If you are using redux devtools you may want to add this snippet to
        // serialize section as WriteAway stores node refences in store
        replacer: (key: string, value: any) => {
          if (value instanceof HTMLElement) { // use your custom data type checker
            return `HTMLElement:${value.tagName}`;
          }
          if (value && value.prototype && value.prototype.isReactComponent) { // use your custom data type checker
            return `IComponent:${(value as any).label}`;
          }
          return value;
        },
      } as any,
    })(...enhancers),
  );
```

```typescript jsx
<>
    <Provider store={store}>
      <MyApplication />
    </Provider>
</>
```

### Use React Pieces

When enabling edit mode, render editable pieces with react components from plugins and to render editors.

```typescript jsx
import { ReactPieceSourceCode } from '@writeaway/plugin-codemirror';
import { ReactPieceBlockBackground, ReactPieceImage, ReactPieceRichText } from '@writeaway/plugin-medium';
import { ReactPieceSeo } from '@writeaway/plugin-seo';

export const App = () => (
  <main>
          <ReactPieceBlockBackground
            id="bg-1"
            name="Background For Rich Text"
            bgColor="#FFcccc"
            className="p-4"
          >
            <article>
              <h2>Rich Text Block</h2>
              <ReactPieceRichText
                id="rich-1"
                name="Rich Text"
                html="<div>Editable Rich Text</div>"
              />
            </article>
          </ReactPieceBlockBackground>
          <ReactPieceBlockBackground
            id="bg-2"
            name="Background For Image"
            bgColor="#ccFFcc"
            className="p-4"
          >
            <article>
              <h2>Image Block</h2>
              <ReactPieceImage
                id="image-1"
                name="image"
                src="https://writeaway.github.io/images/image-06.jpg"
                title="Editable Image"
                alt="Sample Image"
              />
            </article>
          </ReactPieceBlockBackground>
          <ReactPieceBlockBackground
            id="bg-3"
            bgColor="#ccccff"
            name="Background For Source Code Block"
            className="p-4"
            src="https://writeaway.github.io/images/sayagata-400px.png"
          >
            <article>
              <h2>Source Code Block</h2>
              <ReactPieceSourceCode
                id="source-1"
                name="Source edit"
                html={codeStr}
                updateNode
              />
            </article>
          </ReactPieceBlockBackground>
          <article className="p-4">
            <h2>SEO data block</h2>
            <div className="btn">
              <ReactPieceSeo
                id="seo-1"
                name="SEO Data"
                label="Click to Edit SEO Meta Data"
                header="<meta></meta>"
                title="Page Title"
                description="Page Descriptions"
                keywords="Page Keywords"
              />
            </div>
          </article>
</main>);
```

In the body, render navbar, toast controller, overlay and editors

```typescript jsx
        <WriteAwayOverlay />
        <WriteAwayNavBar options={
          {
            navBarDraggable: true,
            navBarCollapsable: true,
            pieceNameGroupSeparator: ':',
          }
        }
        />
        <WriteAwayEditors />
        <ReduxToastr
          className="r_toast-container"
          timeOut={4000}
          position="top-right"
        />
```

`WriteAwayEditors` is mandatory for editor functionalities as it renders popups and required overlays for editing inside.

`WriteAwayOverlay` is optional and renders hover effect for nodes

`WriteAwayNavBar` is optional and renders control panel that has switches for editors

`ReduxToastr` container is needed if you need to render redux toast messages from WriteAway

### Special Actions

Few special redux actions are exposed 

```typescript
    import {
      externalPieceUpdateAction, setAPIAction, setMetaAction
    } from '@writeaway/core';
```

externalPieceUpdateAction - explicitly updates data of specific node. You can use it for real-time updates of content from WebSockets connection. Note funtionality relies on `api.resolveConflicts` method that decides if update should be applied.

```typescript
    // There is a server update of `source-1` node by John Doe 
    dispatch(externalPieceUpdateAction(
        {
          id: 'source-1',
          data: { html: "<div>New HTML</div>" },
          meta: { id: 'user-b', label: 'John Doe', time: Date.now() }
        }
    ));
``` 

setAPIAction - sets pieces api dynamically. Usefull when you need to create HTTP instances asyncrously.

```typescript
 
    dispatch(setAPIAction(
        {
          getPieceData: async (piece: IPieceItem) => fetchPieceFromServer(piece.id),
          /* ... */
        }
    ));
``` 

setMetaAction - sets piece meta, that will be attached to pieces updated in this WriteAway editing session. Typically that's info of user who is editing content.

```typescript
     
    dispatch(setMetaAction(
        {
          id: 'user-a',
          label: 'John Smith',
        }
    ));
``` 


### Sample

See fully working [React SPA sample here](https://github.com/writeaway/writeaway/blob/master/packages/react).
    

## WriteAwayCore constructor options

WriteAwayCore accepts [IOptions](https://writeaway.github.io/docs/interfaces/_types_.galleryitem.html) object in constructor

| Option      | Default | Description  |
| :---        |    :---   |          :--- |
| api      | [defaultMinimumApi](https://github.com/writeaway/writeaway/blob/master/packages/core/src/default.ts#27) | data API to work with pieces. See details in WriteAway API section.   |
| piecesOptions   | [defaultPieces](https://github.com/writeaway/writeaway/blob/master/packages/core/src/default.ts#21) | Options for pieces initialization  |
| piecesOptions.selector   | `[data-piece]` | Selector that will be looked for during initialization for auto-attaching to nodes |
| piecesOptions.attribute   | `data-piece` | Attribute having `type` property for Piece initialization |
| piecesOptions.attributeId   | `data-id` | Attribute having `id` property for Piece initialization |
| piecesOptions.attributeName   | `data-name` | Attribute having `name` property for Piece initialization |
| piecesOptions.components   | {} | Maps piece type to [IComponent](https://writeaway.github.io/docs/interfaces/_types_.icomponent.html) that are launched as piece editor |
| piecesOptions.options   | {} | Maps piece type to options that will be passed to each of editor instances |
| piecesOptions.nameGroupSeparator   | `,` | Name separator for piece names, i.e. if separator is ':' names like 'Body:Article' and 'Body:About' will be grouped under 'Body' with 'Article' and 'About' names |
| piecesRoot   | `document.body` | DOM Element where nodes matching `piecesOptions.selector` will be searched for |
| editorRoot   | `document.body` | DOM Element where editors can put their DOM components, i.e. modals and overlays |
| navBarRoot   | `document.body` | DOM Element where floating navigation bar with core edit controls will be attached to |
| navBarCollapsible   | `true` | If navbar can be collapsed |
| navBarCollapsed   | `false` | Initial collapsed state for navbar |
| navBarDraggable   | `true` | Can navbar be dragged |
| enableEdit   | `true` | Initially enable editors or not |
| expert   | `false` | Initially enable expert mode. Expert mode enables individual piece tracking in nav bar. |
| overlayRoot   | `document.body` | DOM Element where floating hover overlay |
| ajax | `undefined` | If specified, will be passed to default callFetch helper implementation. Refer to code for details. |
| state | `undefined` | If specified, will be used as initial redux state |

## WriteAway API

Specifying `api` params allows to customize where editors are taking data from and where data is saved. Additionally developer can customize how node position is calculated, see [source code](https://github.com/writeaway/writeaway/blob/master/packages/core/src/types.ts) for that.

| Option | Type | Description  |
| :--- | :--- | :--- |
| getPieceData | async (piece: [IPieceItem](https://writeaway.github.io/docs/interfaces/_types_.ipieceitem.html)) => [IPieceItem](https://writeaway.github.io/docs/interfaces/_types_.ipieceitem.html) | Async function to resolve complete piece data. Typically that means resolving `data` by `id` or extracting data directly from `node`  |
| savePieceData | async (piece: [IPieceItem](https://writeaway.github.io/docs/interfaces/_types_.ipieceitem.html)) => void | Async function to save complete piece data  |
| getImageList | async (ref: {id: string, type: string, data: any, dataset: any}) => Array< [IGalleryItem](https://writeaway.github.io/docs/interfaces/_types_.galleryitem.html) > | Optional. If specified will fetch images for this piece and show image options |
| uploadImage | async (file: File or FileList) => [IGalleryItem](https://writeaway.github.io/docs/interfaces/_types_.galleryitem.html) or Array< [IGalleryItem](https://writeaway.github.io/docs/interfaces/_types_.galleryitem.html) > | Optional. If specified enable upload functionality |
| deleteImage | async (id: string) => void | Optional. If specified will enable image deletion functionality and will be used to delete images from gallery  |



## Usage with Spiral Framework

When using with spiral framework, use `@writeaway/spiral-bridge` bundle or pre-compiled scripts

[See documentation here](https://github.com/writeaway/writeaway/blob/master/packages/spiral-bridge)


## Developing and building

 ```bash
 yarn
 yarn build
 ```

## License
MIT
