"use strict";
var Redaxtor = require('../src');
var RedaxtorMedium = require('redaxtor-medium');
require('medium-editor/dist/css/medium-editor.css');
require('redaxtor-medium/lib/redaxtor-medium.css');
require('../src/css/redaxtor.css')

var RedaxtorCodemirror = require('redaxtor-codemirror');
require('codemirror/lib/codemirror.css');

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
