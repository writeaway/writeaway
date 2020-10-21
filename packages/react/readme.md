## WriteAway

This package is a demo of integration of WriteAway to React SPA application

See source code for more details

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
