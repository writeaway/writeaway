# Media editor plugins for WriteAway

## Usage

```
npm install --save @writeaway/core
npm install --save @writeaway/plugin-medium
```

And then in code of bundle

```typescript
    import { WriteAwayCore } from '@writeaway/core';
    import { WriteAwayBackground, WriteAwayImageTag, WriteAwayMedium } from '@writeaway/plugin-medium';
        
    // Define which piece type is handled by which editor
    const components = {
      html: WriteAwayMedium,
      image: WriteAwayImageTag,
      background: WriteAwayBackground,
    };
    
    
    const writeaway = new WriteAwayCore({
      piecesOptions: {
        components,
        options: {
          html: {}, // Options for html editor        
          image: {}, // Options for image editor        
          background: {}, // Options for background editor        
        }   
      },
    });
```

### Specifics

#### Data Types HTML Editor

Piece fields `data` has following fields

`html` - HTML code of piece node

`updateNode` - Optional. Default `true`. Indicates if that data should be applied to node. Specify `false` for nodes with `script` tags as repeatedly adding script tag can produce unexpected effects

#### Piece Options HTML Editor

User can specify `pickerColors` string array with colors for color picker

```typescript
    const writeaway = new WriteAwayCore({
      piecesOptions: {
        components,
        options: {
          html: {
            pickerColors: ['#ff0000', '#00FF00']
          }, // Options for html editor        
        }   
      },
    });
```

#### Data Types Image Editor

Piece fields `data` has following fields

`id` - image id if any

`src` - image source URL

`thumbnailSrc` - image thumbnail source URL

`title` - Title attribute

`alt` - Alt attribute 

#### Piece Options Image Editor

No options for piece editors supported 

#### Data Types Background Editor

Piece fields `data` has following fields

`bgRepeat` - value for 'background-repeat' style

`bgPosition` - value for 'background-position' style

`bgColor` - value for 'background-color' style

`bgSize` - value for 'background-size' style

`src` - image source URL for url in background

`id` - image id if any

`title` - Title attribute

`alt` - Alt attribute 

#### Piece Options Background Editor

User can specify `pickerColors` string array with colors for color picker

```typescript
    const writeaway = new WriteAwayCore({
      piecesOptions: {
        components,
        options: {
          background: {
            pickerColors: ['#ff0000', '#00FF00']
          }, // Options for html editor        
        }   
      },
    });
``` 
