import MediumEditor from 'medium-editor';

export const SaveButton = (MediumEditor as any).Extension.extend({
  name: 'save',
  init() {
    this.button = this.document.createElement('button');
    this.button.classList.add('medium-editor-action', 'save-button');
    this.button.innerHTML = '<i class="rx_icon rx_icon-save2"></i>';
    this.button.title = 'Save Changes';
    this.handleClickBinded = this.handleClick.bind(this);
    this.on(this.button, 'click', this.handleClickBinded);
  },
  getButton() {
    return this.button;
  },
  handleClick() {
    this.base.trigger('save', {}, this.base);
  },
  destroy() {
    this.off(this.button, 'click', this.handleClickBinded);
  },
});

(MediumEditor as any).extensions.saveButton = SaveButton;
