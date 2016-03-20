# Redaxtor
Redaxtor is a JavaScript library for editing CMS pieces, pages and internationalisation on the client side.
Based on [React](https://facebook.github.io/react/) and [Redux](http://redux.js.org/).
Built with [Webpack](https://webpack.github.io/).
Written in ES2015.

## Installation
```
npm install --save redaxtor
```

## The Gist
```js
import Redaxtor from 'Redaxtor'

//import your components for the Redaxtor
import Navigation from "./components/Navigation"
import MediumEditor from "./components/MediumEditor/"
let components = {
    navigation: Navigation,
    html: MediumEditor
}

//initialise Redaxtor with options
//ANY option and suboption is optional and has default value
let redaxtor = new Redaxtor({
    pieces: {
        attribute: "data-piece",
        idAttribute: "data-id",
        fetchAttribute: "data-fetch",
        saveAttribute: "data-save",
        components: components,
        initialState: {}
    },
    i18n: i18n,
    state: {}
});
```

## API
### Pieces
*TODO data-piece -> data-type and data-id -> data-piece*
Each piece should have:
* type - ```data-piece```
* id - ```data-id```
* url to fetch data and options - ```data-url```

After enabling edit mode - each piece will fetch data from the server
#### Get data and options
Request:
```
  id string|number - optional?
  type string
```
Response:
```
  html string
  data jsonString|object
  saveUrl string - optional if data-save is provided
```

#### Save
Request:
```
  id string|number - optional?
  type string
```
Response:
```
  errors optional
  message optional
```


### I18N TODO
I18N object can be provided as object or as URL to fetch from on redaxtor initialisation.
#### I18N object format

## Developing and building
Clone the repository.
 ```bash
 npm install
 npm run build:umd
 or
 npm run build:umd:min
 ```

## License
MIT