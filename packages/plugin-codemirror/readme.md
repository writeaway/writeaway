# Code editor plugin for WriteAway

## Usage

```
npm install --save @writeaway/core
npm install --save @writeaway/plugin-codemirror
```

And then in code of bundle

```typescript
    import { WriteAwayCore } from '@writeaway/core';
    import { WriteAwayCodeMirror } from '@writeaway/plugin-codemirror';
    
    // Define which piece type is handled by which editor
    const components = {
      source: WriteAwayCodeMirror,
    };
    
    const writeaway = new WriteAwayCore({
      piecesOptions: {
        components,
        options: {
          source: {}, // Options for editor        
        }   
      },
    });
```

### Specifics

#### Data Types

Piece fields `data` has following fields

`html` - HTML code of piece node

`updateNode` - Optional. Default `true`. Indicates if that data should be applied to node. Specify `false` for nodes with `script` tags as repeatedly adding script tag can produce unexpected effects

#### Piece Options

No options for piece editors supported 
