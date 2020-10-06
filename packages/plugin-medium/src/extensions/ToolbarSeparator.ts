var MediumEditor = require('medium-editor/dist/js/medium-editor.js');
(function () {
    'use strict';
    var ToolbarSeparator = MediumEditor.Extension.extend({
        name: 'separator',
        init: function () {
            this.button = this.document.createElement('div');
            this.button.classList.add('separator');
        },
        getButton: function () {
            return this.button;
        },
    });
    MediumEditor.extensions.toolbarSeparator = ToolbarSeparator;
}());
