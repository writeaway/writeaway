"use strict";
var Redaxtor = require('redaxtor');
var RedaxtorMedium = require('redaxtor-medium');
require('medium-editor/dist/css/medium-editor.css');
require('redaxtor-medium/lib/redaxtor-medium.css');

var components = {
    html: RedaxtorMedium
}

var redaxtor = new Redaxtor({
    pieces: {
        attribute: "data-piece",//optional
        attributeId: "data-id",//optional
        attributeGetURL: "data-get-url",//optional
        attributeSaveURL: "data-save-url",//optional
        components: components,
        initialState: {
            main: {data: {html: "<h1>qwer asdf zxcv</h1>"}}
        }
    }
});

window.redaxtor = redaxtor;