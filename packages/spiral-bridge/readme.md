## Usage in Spiral Projects

### 1. Include scripts 

Include `writeaway-spiral.js` in your project. I.e. `@writeaway/spiral-bridge/dist/writeaway-spiral.js`
Include default styles from `@writeaway/spiral-bridge/dist/css/writeaway-spiral.css`

Typical Spiral Framework PHP initialization sample.

````html
    <script src="@writeaway/spiral-bridge/dist/writeaway-spiral.js" type="text/javascript">
    <script type="text/javascript">
        /**
         * WriteAwayBridge variable is put in global scope in application entry point by front end engineer
         */
        WriteAwayBridge.start({
            imageGalleryUrl: "<?= uri('api_images_list') ?>", // Url to fetch images list
            getPieceBulkUrl: "<?= uri('api_pieces_list', ['action' => 'get']) ?>", // Url to fetch piece data by multiple ids
            getPieceUrl: "<?= uri('api_pieces', ['action' => 'get']) ?>", // Url to fetch piece data. This is fired only for pieces that can't be read directly from DOM
            saveMetaUrl: "<?= uri('api_seo', ['action' => 'save']) ?>", // Url to save SEO data from SEO editor
            savePieceUrl: "<?= uri('api_pieces', ['action' => 'save']) ?>", // Url to save piece. This may be overrided by piece container 'data-save-url' attribute
            uploadUrl: "<?= uri('api_images_upload') ?>", // Url to upload image resources
            deleteImageUrl: "<?= uri('api_images_delete') ?>" // Url to delete image
        },
         "<meta></meta>", // Specify HTML for custom meta page headers here for SEO Editor,
         {
            html: { // Options per editor type, if any
                pickerColors: ["red", "blue"]
            }   
         },
         { // Meta data to attach to pieces when editing them
            id: "user-id",
            label: "John Smith",    
         }          
     );
    </script>
````

### 2. Markup 

To add piece to editor, mark it up like so

```html
    <element data-piece="Piece Type" data-id="unique id" data-name="Human Readable Name">...</element> 
```

### 3. Add additional attributes

Add `data-get-url` to override get piece URL for specific piece
Add `data-save-url` to override save piece URL for specific piece

### 4. Add global variable `SEO_META` for SEO attributes on page.

These variables will be merged to get and save requests for SEO. Put there anything server needs to identify current view.

```html
    <script>
        var SEO_META = {
                            "pageId": "Spiral page id to save meta to"
                       }    
    </script>
```

### 5. Ensure server implements following API

Note all urls can be overridden by config and per piece with custom attributes

#### POST `api/pieces/get` - getting single piece item

**Request**

| Field | Type | Description  |
| :--- | :--- | :--- |
| id | string | Unique piece id, extracted from `data-id` attribute |
| type | string | Editor type, extracted from `data-type` attribute |
| data | any | Optionally has current data of a piece |
| dataset | any | Has all data attributes of a node |

**Response**

Response should have `data` field of following structures:

| Field | Type | Description  |
| :--- | :--- | :--- |
| id | string | Piece id |
| type | string | Piece type |
| data | any | Optional. Piece data, type is specific for piece type. If not returned piece may not start. |
| meta | IMeta | Optional. Piece meta data to control who and when modified piece last. Required for concurrent edit mode, optional otherwise. |
| message | string | Optional. message to show for piece visible in expert mode |
| messageType | string | Optional. Message error level: 'error' or 'warning' |

`data` and `dataset` are passed, but will be deprecated and should be ignored on server

When `type=seo` id can be missing, but all data from `SEO_META` variable will present

**Request sample**

```json
  {
     "id": "unique-id",
     "type": "html"   
  }
```

**Response sample**

```json
  {
     "status": 200,
     "data": {
       "id": "unique-id",
       "type": "html",
       "data": {
          "html": "<div>Content</div>"
       },   
       "meta": {
          "id": "user id",
          "label": "Anna",
          "time": 12345
       }      
    }
  }
```

#### POST `api/pieces/save` - saving single piece

| Field | Type | Description  |
| :--- | :--- | :--- |
| id | string | Unique piece id, extracted from `data-id` attribute |
| type | string | Editor type, extracted from `data-type` attribute |
| data | any | Optionally has current data of a piece |
| meta | IMeta | Optional. Piece meta data to control who and when modified piece last. Required for concurrent edit mode, optional otherwise. |
| dataset | any | Has all data attributes of a node |

`data` and `dataset` are passed, but will be deprecated and should be ignored on server

When `type=seo` id can be missing, but all data from `SEO_META` variable will present

**Request sample**

```json
  {
     "id": "unique-id",
     "type": "html",
     "data": {
          "html": "<div>Content</div>"
     },   
     "meta": {
        "id": "user id",
        "label": "Anna",
        "time": 12345
     }      
  }
```

**Response sample**

```json
  {
      "status": 200,
      "data": {
         "id": "unique-id",
         "type": "html",
         "data": {
              "html": "<div>Modified Content</div>"
          },   
          "meta": {
             "id": "user id",
             "label": "Anna",
             "time": 12345
          } 
     
      }
  }
```

#### POST `api/pieces/saveMeta` - saving SEO meta

| Field | Type | Description  |
| :--- | :--- | :--- |
| id | string | Unique piece id, extracted from `data-id` attribute |
| type | string | Editor type, extracted from `data-type` attribute |
| data | any | Optionally has current data of a piece |
| meta | IMeta | Optional. Piece meta data to control who and when modified piece last. Required for concurrent edit mode, optional otherwise. |
| dataset | any | Has all data attributes of a node |

`data` and `dataset` are passed, but will be deprecated and should be ignored on server

When `type=seo` id can be missing, but all data from `SEO_META` variable will present

**Request sample**

```json
  {
     "id": "unique-id",
     "type": "html",
      "data": {
          "html": "<div>Content</div>"
      }     
  }
```

**Response sample**

```json
  {
      "status": 200,
      "data": {
         "id": "unique-id",
         "type": "html",
         "data": {
              "html": "<div>Modified Content</div>"
          },   
          "meta": {
             "id": "user id",
             "label": "Anna",
             "time": 12345
          }       
      }
  }
```

#### POST `api/pieces/bulk` - getting batch of items

**Request**

| Field | Type | Description  |
| :--- | :--- | :--- |
| id | string[] | string array of piece ids |

**Response**

Response should have `data` field as array of following structures:

| Field | Type | Description  |
| :--- | :--- | :--- |
| id | string | Piece id |
| type | string | Piece type |
| data | any | Optional. Piece data, type is specific for piece type. If not returned piece may not start. |
| meta | IMeta | Optional. Piece meta data to control who and when modified piece last. Required for concurrent edit mode, optional otherwise. |
| message | string | Optional. message to show for piece visible in expert mode |
| messageType | string | Optional. Message error level: 'error' or 'warning' |

**Request sample**

```json
  {
     "id": ["unique-id", "unique-id-2", "unique-id-3"]
  }
```

**Response sample**

```json
  {
    "status": 200,
    "data": [
      {
        "id": "unique-id",
        "type": "html",
        "data": {
          "html": "<div>Content</div>"
        }
      },
      {
        "id": "unique-id",
        "type": "html",
        "data": {
          "html": "<div>Content</div>"
        }
      },
      {
        "id": "unique-id",
        "type": "html",
        "message": "Piece does not exist",
        "messageType": "error"
      }
    ]
  }  
```

#### POST `api/pieces/images` - getting images for piece

**Request**

| Field | Type | Description  |
| :--- | :--- | :--- |
| id | string | Piece id |
| type | string | Piece type |

**Response**

Response should have `data` field as array of following structures:

| Field | Type | Description  |
| :--- | :--- | :--- |
| id | string | Image id |
| src | string | Image source URL |
| thumbnailSrc | string | Optional. Image thumbnail URL |
| title | string | Optional. Image tag default title |
| alt | string | Optional. Image tag default alt text |
| height | number | Optional. Image height to display |
| width | number | Optional. Image width to display |

**Request sample**

```json
  {
     "id": "unique-id",
     "type": "image"
  }
```

**Response sample**

```json
  {
    "status": 200,
    "data": [
      {
        "id": "unique-id",
        "src": "image1.png"
      },
      {
        "id": "unique-id",
        "thumbnailSrc": "image2-th.png",
        "src": "image2.png"
      }
    ]
  }  
```

#### POST `api/pieces/upload` - upload image

**Request**

| Field | Type | Description  |
| :--- | :--- | :--- |
| image | File | FormData file item if thats a single file |
| images[] | FileList | FormData file list if thats multiple file upload |

**Response**

Response should have `data` field as array of following structures:

| Field | Type | Description  |
| :--- | :--- | :--- |
| id | string | Image id |
| src | string | Image source URL |
| thumbnailSrc | string | Optional. Image thumbnail URL |
| title | string | Optional. Image tag default title |
| alt | string | Optional. Image tag default alt text |
| height | number | Optional. Image height to display |
| width | number | Optional. Image width to display |

**Response sample**

```json
  {
    "status": 200,
    "data": [
      {
        "id": "unique-id",
        "src": "image1.png"
      },
      {
        "id": "unique-id",
        "thumbnailSrc": "image2-th.png",
        "src": "image2.png"
      }
    ]
  }  
```

#### POST `api/pieces/images/delete` - delete image from gallery

**Request**

| Field | Type | Description  |
| :--- | :--- | :--- |
| id | string | Piece id |

**Request sample**

```json
  {
     "id": "unique-id",
  }
```

## Concurrent Edits

To enable concurrent edits in Spiral WriteAway project 

1. Include [Spiral Websockets Client](https://github.com/spiral/websocket-client) to project

2. Implement `writeaway` channel on server that should produce `message` events with [IPiece](https://writeaway.github.io/docs/interfaces/_types_.ipiece.html) payloads having real-time updates from other users

```json
    {
         "id": "unique-id",
         "type": "html",
         "data": {
              "html": "<div>Modified Content</div>"
          },   
          "meta": {
             "id": "user id",
             "label": "Anna",
             "time": 12345
          }       
      }
```

3. Add writeaway adapter script   

```html
    <script src="https://cdn.jsdelivr.net/gh/spiral/websockets/build/socket.js"></script>
    <script type="text/javascript">
        var Socket = SFSocket.SFSocket;
        var connection = new Socket({ host: 'localhost'});
    </script>

    <script src="@writeaway/spiral-bridge/dist/writeaway-spiral.js" type="text/javascript">
    
    <script type="text/javascript">
        /**
         * WriteAwayBridge variable is put in global scope in application entry point by front end engineer
         */
        WriteAwayBridge.start({
            imageGalleryUrl: "<?= uri('api_images_list') ?>", // Url to fetch images list
            getPieceUrl: "<?= uri('api_pieces', ['action' => 'get']) ?>", // Url to fetch piece data. This is fired only for pieces that can't be read directly from DOM
            getPieceBulkUrl: "<?= uri('api_pieces_list', ['action' => 'get']) ?>", // Url to fetch piece data by multiple ids
            saveMetaUrl: "<?= uri('api_seo', ['action' => 'save']) ?>", // Url to save SEO data from SEO editor
            savePieceUrl: "<?= uri('api_pieces', ['action' => 'save']) ?>", // Url to save piece. This may be overrided by piece container 'data-save-url' attribute
            uploadUrl: "<?= uri('api_images_upload') ?>", // Url to upload image resources
            deleteImageUrl: "<?= uri('api_images_delete') ?>" // Url to delete image
        },
         "<meta></meta>", // Specify HTML for custom meta page headers here for SEO Editor,
         {
            html: { // Options per editor type, if any
                pickerColors: ["red", "blue"]
            }   
         },
         { // Meta data to attach to pieces when editing them
            id: "user-id",
            label: "John Smith",    
         },
         WriteAwayBridge.useWS(connection)          
     );
    </script>
```

## Advanced usage

Make a custom bundle yourself based on this package as a sample.
