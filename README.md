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

## The Gist (CommonJS)
```js
"use strict";
//Include redaxtor and it's default styles
var Redaxtor = require('redaxtor');
require('redaxtor/lib/redaxtor.css');

//Include redaxtor HTML editor and it's default styles
var RedaxtorMedium = require('redaxtor-medium');
require('medium-editor/dist/css/medium-editor.css');
require('redaxtor-medium/lib/redaxtor-medium.css');

//Include redaxtor HTML editor and it's default styles 
var RedaxtorCodemirror = require('redaxtor-codemirror');
require('codemirror/lib/codemirror.css');

//Attach plugins to redaxtor
var components = {
    html: RedaxtorMedium.HTMLEditor,
    image: RedaxtorMedium.IMGSrcEditor,
    background: RedaxtorMedium.BackgroundImageEditor,
    source: RedaxtorCodemirror
}

var redaxtor = new Redaxtor({
    pieces: {
        components: components,
        getURL: "api/pieces/get",//will be overwritten by data-get-url
        saveURL: "api/pieces/save"//will be overwritten by data-save-url
    }
});
```

## The Gist (Static)

````html
    <!-- Include redaxtor and it's default styles -->
    <script lang="text/javascript" src="./dist/redaxtor.min.js"></script>
    <link rel="stylesheet" type="text/css" href="./dist/redaxtor.min.css" charset="utf-8">
    
    
    <!-- Include redaxtor HTML editor and it's default styles -->
    <script lang="text/javascript" src="./dist/redaxtor-medium.min.js"></script>
    <link rel="stylesheet" type="text/css" href="./dist/medium-editor.min.css" charset="utf-8">
    <link rel="stylesheet" type="text/css" href="./dist/redaxtor-medium.min.css" charset="utf-8">
    
        
    <!-- Include redaxtor CODE editor and it's default styles -->
    <script lang="text/javascript" src="./dist/redaxtor-codemirror.min.js"></script>
    <link rel="stylesheet" type="text/css" href="./node_modules/codemirror/lib/codemirror.css" charset="utf-8">
    
````

```js

//Attach plugins to redaxtor
var components = {
    html: RedaxtorMedium.HTMLEditor,
    image: RedaxtorMedium.IMGSrcEditor,
    background: RedaxtorMedium.BackgroundImageEditor,
    source: RedaxtorCodemirror
}

var redaxtor = new Redaxtor({
    pieces: {
        components: components,
        getURL: "api/pieces/get",//will be overwritten by data-get-url
        saveURL: "api/pieces/save"//will be overwritten by data-save-url
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
### Ajax
##### field {message} in response will show bar with message content
 *minimal example*
 ```bash
  { ...
    message: 'Message text'
  ... }
  ```

  *full example*
  ```bash
    { ...
      message: {
        content: 'Message text',
        type: 'error',
        durationTime: 5000    //default 4000
    ... }
   ```

## Developing and building


 ```bash
 npm install
 npm run build
 ```

## License
MIT