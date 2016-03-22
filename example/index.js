"use strict";
var Redaxtor = require('redaxtor');
var RedaxtorMedium = require('redaxtor-medium');
// require('redaxtor-medium/lib/styles.less');

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
        getURL: "lalala"
    }
});

window.redaxtor = redaxtor;