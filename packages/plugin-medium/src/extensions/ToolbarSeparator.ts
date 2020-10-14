import * as MediumEditor from 'medium-editor';

export const ToolbarSeparator = (MediumEditor as any).Extension.extend({
  name: 'separator',
  init() {
    this.button = this.document.createElement('div');
    this.button.classList.add('separator');
  },
  getButton() {
    return this.button;
  },
});

(MediumEditor as any).extensions.toolbarSeparator = ToolbarSeparator;
