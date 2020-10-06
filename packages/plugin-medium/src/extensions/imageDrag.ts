var MediumEditor = require('medium-editor/dist/js/medium-editor.js');
(function () {
    'use strict';

    var ImageDrag = MediumEditor.Extension.extend({
        init: function () {
            MediumEditor.Extension.prototype.init.apply(this, arguments);
            this.subscribe('editableDrag', this.handleDrag.bind(this));
            this.subscribe('editableDrop', this.handleDrop.bind(this));
            this.base.origElements.addEventListener('dragstart', this.handleDragStart.bind(this));
        },
        handleDragStart: function (e) {
            (e.target.tagName && e.target.tagName.toLocaleLowerCase() === 'img') ? this.img = true : e.preventDefault();
        },
        handleDrag: function (event) {
            var className = 'medium-editor-dragover';
            if (event.type === 'dragover') {
                event.target.classList.add(className);
            } else if (event.type === 'dragleave' && event.target.classList) {
                event.target.classList.remove(className);
            }
        },
        handleDrop: function (event) {
            var className = 'medium-editor-dragover';
            event.target.classList.remove(className);
            setTimeout(function(){},100)
        }
    });
    MediumEditor.extensions.imageDrag = ImageDrag;
}());