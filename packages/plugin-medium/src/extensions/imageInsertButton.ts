import * as MediumEditor from 'medium-editor';

export const ImageInsert = (MediumEditor as any).Extension.extend({
  name: 'imageInsert',
  init() {
    this.button = this.document.createElement('button');
    this.button.classList.add('medium-editor-action');
    this.button.innerHTML = '<i class="rx_icon rx_icon-picture-o"></i>';
    this.button.title = 'Image';
    this.handleClickBinded = this.handleClick.bind(this);
    this.on(this.button, 'click', this.handleClickBinded);
  },
  getButton() {
    return this.button;
  },
  handleClick() {
    this.base.trigger('onToggleImagePopup', {}, this.base);
  },
  destroy() {
    this.off(this.button, 'click', this.handleClickBinded);
  },
});
(MediumEditor as any).extensions.imageInsertButton = ImageInsert;
