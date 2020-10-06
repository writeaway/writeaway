var MediumEditor = require('medium-editor/dist/js/medium-editor.js');
import vanillaColorPicker from '../helpers/VanillaColorPicker';

(function () {
    'use strict';
    var ColorPicker = MediumEditor.extensions.button.extend({
        name: "colorPicker",
        action: "applyForeColor",
        aria: "Choose a Color",
        pickerColors: [
            "inherit",
            "#9b59b6",
            "#34495e",
            "#16a085",
            "#27ae60",
            "#2980b9",
            "#8e44ad",
            "#2c3e50",
            "#f1c40f",
            "#e67e22",
            "#e74c3c",
            "#bdc3c7",
            "#95a5a6",
            "#666",
            "#212121",
            "#f39c12",
            "#d2d064",
            "#4fbbf7",
            "#ffffff"
        ],
        contentDefault: "<i class='rx_icon rx_icon-brush editor-color-picker' aria-hidden='true'></i>",

        handleClick: function (e) {
            e.preventDefault();
            e.stopPropagation();

            this.selectionState = this.base.exportSelection();

            var emptySelection = false;
            // If no text selected, select everything and remember empty selection to recover it later
            if (this.selectionState && (this.selectionState.end - this.selectionState.start === 0)) {
                emptySelection = this.selectionState;
                this.base.selectAllContents();
                this.selectionState = this.base.exportSelection();
            }

            var picker = vanillaColorPicker(this.document.querySelector(".medium-editor-toolbar-active .editor-color-picker"));
            picker.set("customColors", this.pickerColors);
            picker.set("positionOnTop");
            picker.openPicker();
            picker.on("colorChosen", (color)=> {
                if(emptySelection) {

                }
                this.base.importSelection(this.selectionState);
                this.document.execCommand("styleWithCSS", false, true);
                if(color==='inherit') {
                    document.execCommand("removeFormat", false, "foreColor");
                } else {
                    this.document.execCommand("foreColor", false, color);
                }

                if(emptySelection) {
                    this.base.importSelection(emptySelection);
                }
            });
        }
    });
    MediumEditor.extensions.colorPicker = ColorPicker;
}());