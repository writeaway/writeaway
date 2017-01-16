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
```javascript
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
    image: RedaxtorMedium.IMGTagEditor,
    background: RedaxtorMedium.BackgroundImageEditor,
    source: RedaxtorCodemirror
};

var redaxtor = new Redaxtor({
    pieces: {
            components: components
        },
        piecesRoot: document,  //Optional. Set document by default. Set root  element for pieces
        enableEdit: true, //Optional. Default: false, If set enables everything editors for pieces after loading
        api: {
            /**
            *  Method to fetch list of image urls for gallery
             * Should resolve into array of strings - URLS
            */
            getImageList: function () {
                return new Promise(function(resolve, reject) {
                    $.get({
                        url: "api/images.json",
                        dataType: "json"
                    }).done(function(data) {
                        resolve(data.data.list);//
                    }).fail(function(error) {
                        reject(error);
                    });
                });
            },
            uploadImage: function() {
    
            },
            /**
            * function for delete image from server
            * @param id id of image
            * @returns {Promise}
            */
            deleteImage: function (id) {
                return new Promise(function(resolve, reject) {
                    resolve();
                });
            },
            /**
             *  Method to specific piece data
             * Should resolve into piece object, having all needed properties
            */
            getPieceData: function (piece) {                
                if (piece.type == "source" || piece.type == "html") {
                    /**
                    * Source and html editors expect `html` property 
                    */
                    return Promise.resolve({
                        ...piece,
                        data: {
                            html: piece.node.innerHTML
                        }
                    });
                }
                if (piece.type == "image") {
                    /**
                    * Image editor expects `src` property with URL of image and `alt` string 
                    */
                    return Promise.resolve({
                        ...piece,
                        data: {
                            src: piece.node.src,
                            alt: piece.node.alt,
                        }
                    });
                }
                if (piece.type == "background") {
                    /**
                    * Background editor expects a set of background styling properties 
                    */
                    return Promise.resolve({
                        ...piece,
                        data: {
                            url: piece.node.style.backgroundImage && piece.node.style.backgroundImage.slice(4, -1).replace(/"/g, ""),
                            bgColor: piece.node.style.backgroundColor,
                            bgRepeat: piece.node.style.backgroundRepeat,
                            bgSize: piece.node.style.backgroundSize,
                            bgPosition: piece.node.style.backgroundPosition,
                            alt: piece.node.title || ""
                        }
                    });
                }
                return Promise.reject()
            },
            /**
            * Should resolve, if piece was saved 
            */
            savePieceData: function(piece) {
                console.info("Saving to server", piece);
                return Promise.resolve();
            }
    } 
});
```

## The Gist (Static)

```html
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
    
```

```javascript

//Attach plugins to redaxtor
var components = {
    html: RedaxtorMedium.HTMLEditor,
    image: RedaxtorMedium.IMGTagEditor,
    background: RedaxtorMedium.BackgroundImageEditor,
    source: RedaxtorCodemirror
};

var redaxtor = new Redaxtor({
    pieces: {
        components: components
    },
    piecesRoot: document,  //Optional. Set document by default. Set root  element for pieces
    enableEdit: true, //Optional. Default: false, If set enables everything editors for pieces after loading
    api: {
        /**
        *  Method to fetch list of image urls for gallery
         * Should resolve into array of strings - URLS
        */
        getImageList: function () {
            return new Promise(function(resolve, reject) {
                $.get({
                    url: "api/images.json",
                    dataType: "json"
                }).done(function(data) {
                    resolve(data.data.list);//
                }).fail(function(error) {
                    reject(error);
                });
            });
        },
        uploadImage: function() {

        },
        /**
        * function for delete image from server
        * @param id id of image
        * @returns {Promise}
        */
        deleteImage: function (id) {
            return new Promise(function(resolve, reject) {
                resolve();
            });
        },
        /**
         *  Method to specific piece data
         * Should resolve into piece object, having all needed properties
        */
        getPieceData: function (piece) {                
            if (piece.type == "source" || piece.type == "html") {
                /**
                * Source and html editors expect `html` property 
                */
                return Promise.resolve({
                    ...piece,
                    data: {
                        html: piece.node.innerHTML
                    }
                });
            }
            if (piece.type == "image") {
                /**
                * Image editor expects `src` property with URL of image and `alt` string 
                */
                return Promise.resolve({
                    ...piece,
                    data: {
                        src: piece.node.src,
                        alt: piece.node.alt,
                    }
                });
            }
            if (piece.type == "background") {
                /**
                * Background editor expects a set of background styling properties 
                */
                return Promise.resolve({
                    ...piece,
                    data: {
                        url: piece.node.style.backgroundImage && piece.node.style.backgroundImage.slice(4, -1).replace(/"/g, ""),
                        bgColor: piece.node.style.backgroundColor,
                        bgRepeat: piece.node.style.backgroundRepeat,
                        bgSize: piece.node.style.backgroundSize,
                        bgPosition: piece.node.style.backgroundPosition,
                        alt: piece.node.title || ""
                    }
                });
            }
            return Promise.reject()
        },
        /**
        * Should resolve, if piece was saved 
        */
        savePieceData: function(piece) {
            console.info("Saving to server", piece);
            return Promise.resolve();
        }
    }
});
```

## API
### Pieces
Each piece should have:
* type - ```data-piece```
* id - ```data-id```
* url to fetch data and options - ```data-get-url```

## Developing and building


 ```bash
 npm install
 npm run build
 ```

## License
MIT