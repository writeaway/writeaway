"use strict";
var Redaxtor = require('../src');
var RedaxtorMedium = require('redaxtor-medium');
require('medium-editor/dist/css/medium-editor.css');
require('redaxtor-medium/lib/redaxtor-medium.css');

var RedaxtorCodemirror = require('redaxtor-codemirror');
require('codemirror/lib/codemirror.css');

var components = {
    html: RedaxtorMedium,
    source: RedaxtorCodemirror
};

var redaxtor = new Redaxtor({
    pieces: {
        components: components,
        initialState: {
            main: {data: {html: "<h1>qwer asdf zxcv</h1>"}}
        }
    }
});

window.redaxtor = redaxtor;