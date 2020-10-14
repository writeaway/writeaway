import * as MediumEditor from 'medium-editor';

export const ResetButton = (MediumEditor as any).Extension.extend({
  name: 'reset',
  init() {
    this.button = this.document.createElement('button');
    this.button.classList.add('medium-editor-action', 'reset-button');
    this.button.innerHTML = '<i class="rx_icon rx_icon-rewind"></i>';
    this.button.title = 'Reset Current Changes';
    this.handleClickBinded = this.handleClick.bind(this);
    this.resetToHTML = this.base.getContent();
    this.on(this.button, 'click', this.handleClickBinded);
  },
  getButton() {
    return this.button;
  },
  handleClick() {
    if ((this.base.getContent() !== this.resetToHTML)) {
      (this.base.setContent(this.resetToHTML));
    }
  },
  destroy() {
    this.off(this.button, 'click', this.handleClickBinded);
  },
});

(MediumEditor as any).extensions.resetButton = ResetButton;
