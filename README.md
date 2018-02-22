# WriteAway
WriteAway is a JavaScript library for editing CMS pieces and pages on the client side.
Based on [React](https://facebook.github.io/react/) and [Redux](http://redux.js.org/).
Built with [Webpack](https://webpack.github.io/).
Written in ES2015.
Created by [SpiralScout](http://spiralscout.com).

## Installation

Install redaxtor base and it's plugins

```
npm install --save redaxtor
npm install --save redaxtor-medium
npm install --save redaxtor-codemirror
npm install --save redaxtor-seo
```

## The Gist (CommonJS)

See [Typescript Typings](./src/index.d.ts) for more details

```javascript
    // Include redaxtor and it's default styles
    
    var Redaxtor = require('redaxtor');
    require('redaxtor/lib/redaxtor.css');
    
    // Include redaxtor Rich Text editor and it's default styles
    // RedaxtorMedium exports 3 components:
    // 
    var RedaxtorMedium = require('redaxtor-medium');
    require('medium-editor/dist/css/medium-editor.css');
    require('redaxtor-medium/lib/redaxtor-medium.css');

    // Include redaxtor source code editor and it's default styles 
    var RedaxtorCodemirror = require('redaxtor-codemirror');
    require('codemirror/lib/codemirror.css');

    // Attach plugins to redaxtor
    var components = {
        html: RedaxtorMedium.HTMLEditor,
        image: RedaxtorMedium.IMGTagEditor,
        background: RedaxtorMedium.BackgroundImageEditor,
        source: RedaxtorCodemirror
    };

    var redaxtor = new Redaxtor({
    pieces: {
            components: components,
            options: {
                html: {
                    pickerColors: [
                        "#666",
                        "#212121",
                        "#f39c12",
                        "#d2d064",
                        "#4fbbf7",
                        "#ffffff"
                    ]
                }
            }
        },
        piecesRoot: document,  //Optional. Set document by default. Set root  element for pieces
        editorActive: true, //Optional. Default: false, If set enables everything editors for pieces after loading
        navBarRoot: document.querySelector('.bs-docs-header .container'), //Optional. Default: document.body, Set place for the Redaxtor bar
        navBarDraggable: true, //Optional. Default: true, If set `true` enables dragging of the redaxtor panel
        navBarCollapsable: true, //Optional. Default: true, If set `true` enables collapsing of the redaxtor panel. If set `false` set the panel to the open state and disables collapsing   
        navBarCollapsed: true, //Optional. Default: true, defines navbar is collapsed on creating or not
        pieceNameGroupSeparator: ':', // Optional. Set name separator for grouping blocks 
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
                    * updateNode - define that is need to update piece after change code. Default value: true
                    */
                    return Promise.resolve({
                        ...piece,
                        data: {
                            html: piece.node.innerHTML,
                            updateNode: true
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
                    const computedStyle = getComputedStyle(piece.node);
                    return Promise.resolve({
                        ...piece,
                        data: {
                             url: computedStyle.backgroundImage && computedStyle.backgroundImage.slice(4, -1).replace(/"/g, ""),
                             bgColor: computedStyle.backgroundColor,
                             bgRepeat: computedStyle.backgroundRepeat,
                             bgSize: computedStyle.style.backgroundSize,
                             bgPosition: computedStyle.style.backgroundPosition,
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
        components: components,
        options: {
                html: { //Pass options to HTML Editor
                    pickerColors: [
                        "#666",
                        "#212121",
                        "#f39c12",
                        "#d2d064",
                        "#4fbbf7",
                        "#ffffff"
                    ]
                }
            }
    },
    piecesRoot: document,  //Optional. Set document by default. Set root  element for pieces
    enableEdit: true, //Optional. Default: false, If set enables everything editors for pieces after loading
    navBarRoot: document.querySelector('.bs-docs-header .container'), //Optional. Default: document.body, Set place for the Redaxtor bar
    navBarDraggable: true, //Optional. Default: true, If set `true` enables dragging of the redaxtor panel
    navBarCollapsable: true, //Optional. Default: true, If set `true` enables collapsing of the redaxtor panel. If set `false` set the panel to the open state and disables collapsing   
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
                * updateNode - define that is need to update piece after change code. Default value: true
                */
                return Promise.resolve({
                    ...piece,
                    data: {
                        html: piece.node.innerHTML,
                        updateNode: true
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
                const computedStyle = getComputedStyle(piece.node);
                return Promise.resolve({
                    ...piece,
                    data: {
                        url: computedStyle.backgroundImage && computedStyle.backgroundImage.slice(4, -1).replace(/"/g, ""),
                        bgColor: computedStyle.backgroundColor,
                        bgRepeat: computedStyle.backgroundRepeat,
                        bgSize: computedStyle.style.backgroundSize,
                        bgPosition: computedStyle.style.backgroundPosition,
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

## Developing and building

 ```bash
 npm install
 npm run build
 ```

## License
MIT
