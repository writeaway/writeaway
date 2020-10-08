### Usage in Spiral Projects

Include `writeaway.min.js` in your project. I.e. `/node_modules/writeaway-spiral-bridge/writeaway.min.js`
For development purposes incluse map file as well, i.e. `/node_modules/writeaway-spiral-bridge/writeaway.min.js.map`

Typical Spiral Framework PHP initialization sample.

````php
    <?php if (spiral(\Spiral\Pieces\Pieces::class)->canEdit()): ?>
        <script src="/node_modules/writeaway-spiral-bridge/writeaway.min.js" type="text/javascript">
        <script type="text/javascript">
            /**
             * WriteAwayBridge variable is put in global scope in application entry point by front end engineer
             */
            WriteAwayBridge.startForSpiral({
                imageGalleryUrl: "<?= uri('api_images_list') ?>", // Url to fetch images list
                getPieceUrl: "<?= uri('api_pieces', ['action' => 'get']) ?>", // Url to fetch piece data. This is fired only for pieces that can't be read directly from DOM
                saveMetaUrl: "<?= uri('api_seo', ['action' => 'save']) ?>", // Url to save SEO data from SEO editor
                savePieceUrl: "<?= uri('api_pieces', ['action' => 'save']) ?>", // Url to save piece. This may be overrided by piece container 'data-save-url' attribute
                uploadUrl: "<?= uri('api_images_upload') ?>", // Url to upload image resources
                deleteImageUrl: "<?= uri('api_images_delete') ?>" // Url to delete image
            },
             "" // Specify HTML for custom meta page headers here for SEO Editor
            );
        </script>
    <?php endif; ?>
````

### Additional attributes

Add `data-get-url` to override get piece URL for specific piece

Add `data-save-url` to override save piece URL for specific piece

### Advanced usage

You can skip calling `startForSpiral` method and research how this [bundle is done](./index-source.js). Also see generic [docs](https://github.com/writeaway/writeaway) and [API](https://github.com/writeaway/writeaway/blob/master/src/index.d.ts) to implement custom logic.


### Node dependency usage in `package.json`

````json
    {
        "dependencies": {
            "writeaway-spiral-bridge": "git@github.com:writeaway/writeaway-spiral-bridge.git#master"
        }
    }
````

### Updating during development

1. Install node
2. Update git submodules
3. Run `npm install` and `npm run build`


### Publishing during development

1. Run `npm publish`
