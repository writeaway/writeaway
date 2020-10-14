# SEO editor plugin for WriteAway

## Usage

```
npm install --save @writeaway/core
npm install --save @writeaway/plugin-seo
```

And then in code of bundle

```typescript
    import { WriteAwayCore } from '@writeaway/core';
    import { WriteAwaySeo } from '@writeaway/plugin-seo';
    
    // Define which piece type is handled by which editor
    const components = {
      seo: WriteAwaySeo,
    };
    
    const writeaway = new WriteAwayCore({
      piecesOptions: {
        components,
        options: {
          seo: {}, // Options for editor        
        }   
      },
    });
```

### Specifics

#### Data Types

Piece fields `data` has following fields

`header` - HTML code inserted in header tag as is

`title` - Page title

`description` - Page description

`keywords` - Page keywords

#### Piece Options

No options for piece editors supported 
