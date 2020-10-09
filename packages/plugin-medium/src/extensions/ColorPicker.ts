import { pickerColors } from 'contants';
import * as MediumEditor from 'medium-editor';
import vanillaColorPicker from '../helpers/VanillaColorPicker';

export const ColorPicker = (MediumEditor as any).extensions.button.extend({
  name: 'colorPicker',
  action: 'applyForeColor',
  aria: 'Choose a Color',
  pickerColors,
  contentDefault: '<i class=\'rx_icon rx_icon-brush editor-color-picker\' aria-hidden=\'true\'></i>',

  handleClick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    this.selectionState = this.base.exportSelection();

    let emptySelection = false;
    // If no text selected, select everything and remember empty selection to recover it later
    if (this.selectionState && (this.selectionState.end - this.selectionState.start === 0)) {
      emptySelection = this.selectionState;
      this.base.selectAllContents();
      this.selectionState = this.base.exportSelection();
    }

    const picker = vanillaColorPicker(this.document.querySelector('.medium-editor-toolbar-active .editor-color-picker'));
    picker.emit('customColors', this.pickerColors);
    picker.emit('positionOnTop');
    picker.openPicker();
    picker.on('colorChosen', (color: string) => {
      if (emptySelection) {

      }
      this.base.importSelection(this.selectionState);
      this.document.execCommand('styleWithCSS', false, true);
      if (color === 'inherit') {
        document.execCommand('removeFormat', false, 'foreColor');
      } else {
        this.document.execCommand('foreColor', false, color);
      }

      if (emptySelection) {
        this.base.importSelection(emptySelection);
      }
    });
  },
});

(MediumEditor as any).extensions.colorPicker = ColorPicker;
