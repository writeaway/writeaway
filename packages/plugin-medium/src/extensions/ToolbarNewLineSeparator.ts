import MediumEditor from 'medium-editor';

export const ToolbarNewLineSeparator = (MediumEditor as any).Extension.extend({
  name: 'newLineSeparator',
  init: function () {
    this.button = this.document.createElement('div');
    this.button.classList.add('newLineSeparator');
  },
  getButton: function () {
    return this.button;
  },
});

(MediumEditor as any).extensions.toolbarNewLineSeparator = ToolbarNewLineSeparator;
