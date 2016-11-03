# Configuration

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