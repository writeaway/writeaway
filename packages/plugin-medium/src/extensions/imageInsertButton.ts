var MediumEditor = require('medium-editor/dist/js/medium-editor.js');
(function () {
    'use strict';
    var ImageInsert = MediumEditor.Extension.extend({
        name: 'imageInsert',
        init: function () {
            this.button = this.document.createElement('button');
            this.button.classList.add('medium-editor-action');
            this.button.innerHTML = '<i class="rx_icon rx_icon-picture-o"></i>';
            this.button.title = "Image";
            this.handleClickBinded = this.handleClick.bind(this);
            this.on(this.button, 'click', this.handleClickBinded);
        },
        getButton: function () {
            return this.button;
        },
        handleClick: function (event) {
            this.base.trigger('onToggleImagePopup',{}, this.base);
        },
        destroy: function(){
            this.off(this.button, 'click', this.handleClickBinded);
        }
    });
    MediumEditor.extensions.imageInsertButton = ImageInsert;
}());
