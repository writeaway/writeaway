var MediumEditor = require('medium-editor/dist/js/medium-editor.js');
(function () {
    'use strict';
    var SaveButton = MediumEditor.Extension.extend({
        name: 'save',
        init: function () {
            this.button = this.document.createElement('button');
            this.button.classList.add('medium-editor-action', 'save-button');
            this.button.innerHTML = '<i class="rx_icon rx_icon-save2"></i>';
            this.button.title = "Save Changes";
            this.handleClickBinded = this.handleClick.bind(this)
            this.on(this.button, 'click', this.handleClickBinded);
        },
        getButton: function () {
            return this.button;
        },
        handleClick: function (event) {
            this.base.trigger('save',{}, this.base);
        },
        destroy: function(){
            this.off(this.button, 'click', this.handleClickBinded);
        }
    });
    MediumEditor.extensions.saveButton = SaveButton;
}());
