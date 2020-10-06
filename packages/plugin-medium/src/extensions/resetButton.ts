var MediumEditor = require('medium-editor/dist/js/medium-editor.js');
(function () {
    'use strict';
    var ResetButton = MediumEditor.Extension.extend({
        name: 'reset',
        init: function () {
            this.button = this.document.createElement('button');
            this.button.classList.add('medium-editor-action', 'reset-button');
            this.button.innerHTML = '<i class="rx_icon rx_icon-rewind"></i>';
            this.button.title = "Reset Current Changes";
            this.handleClickBinded = this.handleClick.bind(this);
            this.resetToHTML = this.base.getContent();
            this.on(this.button, 'click', this.handleClickBinded);
        },
        getButton: function () {
            return this.button;
        },
        handleClick: function (event) {
            (this.base.getContent() !== this.resetToHTML) && (this.base.setContent(this.resetToHTML));
        },
        destroy: function(){
            this.off(this.button, 'click', this.handleClickBinded);
        }
    });
    MediumEditor.extensions.resetButton = ResetButton;
}());
