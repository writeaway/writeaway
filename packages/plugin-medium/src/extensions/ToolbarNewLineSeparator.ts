var MediumEditor = require('medium-editor/dist/js/medium-editor.js');
(function () {
    'use strict';
    var ToolbarNewLineSeparator = MediumEditor.Extension.extend({
        name: 'newLineSeparator',
        init: function () {
            this.button = this.document.createElement('div');
            this.button.classList.add('newLineSeparator');
        },
        getButton: function () {
            return this.button;
        },
    });
    MediumEditor.extensions.toolbarNewLineSeparator = ToolbarNewLineSeparator;
}());
