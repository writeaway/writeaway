# WriteAway
WriteAway is a JavaScript library for editing CMS pieces inline on pages on the client side.

Based on [React](https://facebook.github.io/react/) and [Redux](http://redux.js.org/)

Created by [SpiralScout](http://spiralscout.com).

WriteAway comes like a core controller with set of plugins for different types of media.

[@writeaway/core](/packages/core) - Core controller for all plugins, includes editor floating bar and manages state of editors

[@writeaway/plugin-medium](/packages/plugin-medium) - Plugin for supporting rich text editing, editing images and block backgrounds

[@writeaway/plugin-coremirror](/packages/plugin-codemirror) - Plugin for editing block's source code, i.e. for embedded iframes or scrips

[@writeaway/plugin-seo](/packages/plugin-seo) - Plugin for editing SEO meta tags

## Installation On Top Of Existing Project

To use on top of existing project you would need to create a custom bundle using your favorite packaging tool. You can see 2 samples of such bundles [on demo website](/packages/bundle) and in [spiral framework bridge](/packages/spiral-bridge)

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
@import "~@writeaway/core/src/styles/redaxtor";
@import "~@writeaway/plugin-medium/src/medium-editor";
@import "~@writeaway/plugin-medium/src/redaxtor-medium";
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

TBD:

## WriteAwayCore constructor options

WriteAwayCore accepts [IOptions](/packages/core/src/types.ts#68) object in constructor

| Option      | Default | Description  |
| :---        |    :---   |          :--- |
| api      | [defaultMinimumApi](/packages/core/src/default.ts#27) | data API to work with pieces. See details in WriteAway API section.   |
| piecesOptions   | [defaultPieces](/packages/core/src/default.ts#21) | Options for pieces initialization  |
| piecesOptions.selector   | `[data-piece]` | Selector that will be looked for during initialization for auto-attaching to nodes |
| piecesOptions.attribute   | `data-piece` | Attribute having `type` property for Piece initialization |
| piecesOptions.attributeId   | `data-id` | Attribute having `id` property for Piece initialization |
| piecesOptions.attributeName   | `data-name` | Attribute having `name` property for Piece initialization |
| piecesOptions.components   | {} | Maps piece type to [IComponent](/packages/core/src/types.ts) that are launched as piece editor |
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

Specifying `api` params allows to customize where editors are taking data from and where data is saved. Additionally developer can customize how node position is calculated, see [advanced documentation](/packages/core/src/types.ts) and code for that.

| Option | Type | Description  |
| :--- | :--- | :--- |
| getPieceData | async (piece: [IPieceItem](/packages/core/src/types.ts)) => [IPieceItem](/packages/core/src/types.ts) | Async function to resolve complete piece data. Typically that means resolving `data` by `id` or extracting data directly from `node`  |
| savePieceData | async (piece: [IPieceItem](/packages/core/src/types.ts)) => void | Async function to save complete piece data  |
| getImageList | async (ref: {id: string, type: string, data: any, dataset: any}) => Array<[IGalleryItem](/packages/core/src/types.ts)> | Optional. If specified will fetch images for this piece and show image options |
| uploadImage | async (file: File or FileList) => [IGalleryItem](/packages/core/src/types.ts) or Array<[IGalleryItem](/packages/core/src/types.ts)> | Optional. If specified enable upload functionality |
| deleteImage | async (id: string) => void | Optional. If specified will enable image deletion functionality and will be used to delete images from gallery  |



## Usage with Spiral Framework

When using with spiral framework, use `@writeaway/spiral-bridge` bundle or pre-compiled scripts

[See documentation here](/packages/spiral-bridge)


## Developing and building

 ```bash
 yarn
 yarn build
 ```

## License
MIT
