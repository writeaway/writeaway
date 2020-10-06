var MediumEditor = require('medium-editor/dist/js/medium-editor.js');
(function () {
    'use strict';
    var RedoButton = MediumEditor.Extension.extend({
        name: 'redo',
        init: function () {
            this.button = this.document.createElement('button');
            this.button.classList.add('medium-editor-action');
            this.button.innerHTML = '<i class="rx_icon rx_icon-redo"></i>';
            this.button.title = "Redo Changes";
            this.handleClickBinded = this.handleClick.bind(this);
            this.on(this.button, 'click', this.handleClickBinded);
        },
        getButton: function () {
            return this.button;
        },
        handleClick: function (e) {
            // console.log("REDO");
            e.preventDefault();
            e.stopPropagation();
            let redoContent = this.base.historyManager.redo();
            let selection = this.base.exportSelection();
            if(redoContent) {
                // console.log("REDO", redoContent);
                this.base.setContent(redoContent.html);
                this.base.importSelection(redoContent.caret || selection);
            }
        },
        destroy: function(){
            this.off(this.button, 'click', this.handleClickBinded);
        }
    });
    MediumEditor.extensions.redoButton = RedoButton;
}());
