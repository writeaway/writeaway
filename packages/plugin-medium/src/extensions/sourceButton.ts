import MediumEditor from 'medium-editor';

export const SourceButton = (MediumEditor as any).Extension.extend({
  name: 'source',
  init() {
    this.button = this.document.createElement('button');
    this.button.classList.add('medium-editor-action');
    this.button.classList.add('rx_expert-mode');
    this.button.innerHTML = '<i class="rx_icon rx_icon-mode_edit"></i>';
    this.button.title = 'Edit Source Code';
    this.handleClickBinded = this.handleClick.bind(this);
    this.on(this.button, 'click', this.handleClickBinded);
  },
  getButton() {
    return this.button;
  },
  handleClick() {
    this.base.getExtensionByName('toolbar').hideToolbar();
    this.base.trigger('setCurrentSourcePieceId', {}, this.base);
  },
  destroy() {
    this.off(this.button, 'click', this.handleClickBinded);
  },
});

(MediumEditor as any).extensions.sourceButton = SourceButton;
