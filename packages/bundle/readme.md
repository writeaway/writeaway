This repository is a helper tool that allows to bundle all WriteAway stuff in one file for usage with Spiral

1. Clone [WriteAway repositories](https://github.com/writeaway) in some folder with subfolders `redaxtor` `redaxtor-medium` `redaxtor-codemirror`  `redaxtor-seo` (Note naming) 
2. Clone this repository in same folder. Name does not matter.
3. Run `npm install`
4. Run `npm run build:umd` or `npm run build:umd:min` 

Most recent build is available as minified file directly in repository.
Typical usage:

```
    <script src="writeaway.js"></script>
    <script>
        var writeaway = new WriteAway({
            pieces: {
            },
            api: {
                 getImageList: function (data) {
                    const dataUrl = (data && data.type == "background") ? "api/imagesBg.json" : "api/images.json";
                    return new Promise(function(resolve, reject) {
                        $.get({
                            url: dataUrl ,
                            dataType: "json"
                        }).done(function(data) {
                            resolve(data.data.list);
                        }).fail(function(error) {
                            reject(error);
                        });
                    });
                },
                uploadImage: function() {

                },
                savePieceData: function(piece) {
                    console.info("Saving to server", piece);
                    return Promise.resolve();
                }
            }
        });
    </script>

```

Read about configuring WriteAway on [WriteAway repositories](https://github.com/writeaway)
 
Styling notes
========

This bundle wraps text editors into `redaxtor` DOM element that has `display: block` by default.

Image and background editors are attached in a node before target one in `redaxtor-before` DOM element. This block is `0px x 0px` by default.

Default styles are applied by attaching `r_editor r_edit` classes to target node. This applies to all editor types.

Default CSS styles can be found in [WriteAway repositories](https://github.com/writeaway)

This bundle includes:

```

require('/redaxtor/dist/redaxtor.css'); //Styles for editable blocks hilighting and redaxtor floating bar

require('/redaxtor-medium/dist/medium-editor.css');//Styles for HTML editor
require('/redaxtor-medium/dist/redaxtor-medium.css');//Redaxtor-specific overrides

require('/node_modules/codemirror/lib/codemirror.css');//Styles for Codemirror editor

```

Scripting notes
========

WriteAway is expected to be one and the only JS events handler. Don't attach it to nodes with other handlers or disable them before activating WriteAway.


Customise bundle
========

To customize bundle edit `src/index.js` and re-rerun build