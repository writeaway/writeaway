# Redaxtor-medium
Redaxtor-medium is a MediumEditor plugin for Redaxtor library

## Build
```
npm install
npm run build
```

## The Gist (CommonJS)

```js
var Redaxtor = require('redaxtor');
var RedaxtorMedium = require('redaxtor-medium');
require('!style!css!medium-editor/dist/css/medium-editor.css');
require('!style!css!redaxtor-medium/lib/redaxtor-medium.css');

var components = {
    html: RedaxtorMedium.HTMLEditor,
    image: RedaxtorMedium.IMGTagEditor
}

let redaxtor = new Redaxtor({
    pieces: {
        components: components
    }
});
```

## The Gist (Static)

````html
    <script lang="text/javascript" src="./dist/redaxtor.min.js"></script>
    <script lang="text/javascript" src="./dist/redaxtor-medium.min.js"></script>
    <link rel="stylesheet" type="text/css" href="./dist/medium-editor.min.css" charset="utf-8">
    <link rel="stylesheet" type="text/css" href="./dist/redaxtor-medium.min.css" charset="utf-8">
````

```js
var components = {
    html: RedaxtorMedium.HTMLEditor
}

var redaxtor = new Redaxtor({
    pieces: {
        components: components
    }
});
```
