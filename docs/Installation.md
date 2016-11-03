# Installation
As Redaxtor itself is not useful without some plugins,
so it's need to install and build them together.
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