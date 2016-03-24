# Redaxtor
Redaxtor is a JavaScript library for editing CMS pieces, pages and internationalisation on the client side.
Based on [React](https://facebook.github.io/react/) and [Redux](http://redux.js.org/).
Built with [Webpack](https://webpack.github.io/).
Written in ES2015.
Created by [Alex Chepura](https://twitter.com/alexchepura) and [Zmicer Boksha](https://github.com/ZmicerBoksha).
Open sourced by [SpiralScout](http://spiralscout.com).

## Installation
```
npm install --save redaxtor
```

## The Gist
```js
"use strict";
var Redaxtor = require('redaxtor');
var RedaxtorMedium = require('redaxtor-medium');
require('medium-editor/dist/css/medium-editor.css');
require('redaxtor-medium/lib/redaxtor-medium.css');

var RedaxtorCodemirror = require('redaxtor-codemirror');
require('codemirror/lib/codemirror.css');

var components = {
    html: RedaxtorMedium,
    source: RedaxtorCodemirror
}

var redaxtor = new Redaxtor({
    pieces: {
        components: components,
    }
});
```

## API
### Pieces
Each piece should have:
* type - ```data-piece```
* id - ```data-id```
* url to fetch data and options - ```data-get-url```

After enabling edit mode - each piece will fetch data from the server

## Developing and building
Clone the repository.
 ```bash
 npm install
 npm run build
 ```

## License
MIT