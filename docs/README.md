# Introduction  
Redaxtor is a try to solve the problem of inline cms editing.  
*There is also an intention to edit cms pages and I18N, but it's far from done yet*

Editable parts of cms we named 'pieces'.

Redaxtor itself doesn't allow to edit cms pieces, but it provides an interface for plugins.  

## 2 most essential plugins are:
- html [redaxtor-medium](https://github.com/redaxtor/redaxtor-medium)
- source [redaxtor-codemirror](https://github.com/redaxtor/redaxtor-codemirror)

## Installation
```
npm install --save redaxtor redaxtor-medium redaxtor-codemirror
```

## Build with plugins
```js
const Redaxtor = require('redaxtor')
const RedaxtorMedium = require('redaxtor-medium')
require('medium-editor/dist/css/medium-editor.css')
require('redaxtor-medium/lib/redaxtor-medium.css')

const RedaxtorCodemirror = require('redaxtor-codemirror')
require('codemirror/lib/codemirror.css')

const components = {
  html: RedaxtorMedium,
  source: RedaxtorCodemirror
}
```

## Initialization
```js
const redaxtor = new Redaxtor({
  pieces: {
    components: components,
    getURL: "api/pieces/get",
    saveURL: "api/pieces/save"
  }
})
```

## Ajax configuration
```js
const redaxtor = new Redaxtor({
  ajax: {
    headers: {
      "X-CSRF-TOKEN": window.csrfToken
    }
  },
  ...
  })
```