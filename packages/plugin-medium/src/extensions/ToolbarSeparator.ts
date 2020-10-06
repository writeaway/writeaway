import MediumEditor from 'medium-editor';

export const ToolbarSeparator = (MediumEditor as any).Extension.extend({
  name: 'separator',
  init: function () {
    this.button = this.document.createElement('div');
    this.button.classList.add('separator');
  },
  getButton: function () {
    return this.button;
  },
});

(MediumEditor as any).extensions.toolbarSeparator = ToolbarSeparator;
