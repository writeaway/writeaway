import MediumEditor from 'medium-editor';

export const SaveButton = (MediumEditor as any).Extension.extend({
  name: 'save',
  init: function () {
    this.button = this.document.createElement('button');
    this.button.classList.add('medium-editor-action', 'save-button');
    this.button.innerHTML = '<i class="rx_icon rx_icon-save2"></i>';
    this.button.title = 'Save Changes';
    this.handleClickBinded = this.handleClick.bind(this)
    this.on(this.button, 'click', this.handleClickBinded);
  },
  getButton: function () {
    return this.button;
  },
  handleClick: function () {
    this.base.trigger('save', {}, this.base);
  },
  destroy: function () {
    this.off(this.button, 'click', this.handleClickBinded);
  }
});

(MediumEditor as any).extensions.saveButton = SaveButton;
