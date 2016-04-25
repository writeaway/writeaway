"use strict";
var Redaxtor = require('../src');
var RedaxtorMedium = require('redaxtor-medium');
require('style!css?-url!medium-editor/dist/css/medium-editor.css');
require('style!css?-import!redaxtor-medium/lib/redaxtor-medium.css');

var RedaxtorCodemirror = require('redaxtor-codemirror');
require('style!css?-url!codemirror/lib/codemirror.css');

var components = {
    html: RedaxtorMedium,
    source: RedaxtorCodemirror
};

//PER PROJECT BUNDLE - includes components needed for particular projects
class RedaxtorBundle extends Redaxtor {
    constructor(options) {
        options.pieces.components = components;
        super(options);
    }
}

module.exports = RedaxtorBundle;

//Other way is to bundle and init right here
/*
var redaxtor = new RedaxtorBundle({
    pieces: {
        components: components,
    },
    pages: {
        getAllURL: "api/pages.json",
        createURL: "api/pagesCreate.json",//optional, if not provided - saveURL will be used
        saveURL: "api/pagesSave.json",
        deleteURL: "api/pagesDelete.json"
    }
});*/
