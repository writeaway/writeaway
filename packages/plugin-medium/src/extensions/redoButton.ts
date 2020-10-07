import MediumEditor from 'medium-editor';

export const RedoButton = (MediumEditor as any).Extension.extend({
  name: 'redo',
  init() {
    this.button = this.document.createElement('button');
    this.button.classList.add('medium-editor-action');
    this.button.innerHTML = '<i class="rx_icon rx_icon-redo"></i>';
    this.button.title = 'Redo Changes';
    this.handleClickBinded = this.handleClick.bind(this);
    this.on(this.button, 'click', this.handleClickBinded);
  },
  getButton() {
    return this.button;
  },
  handleClick(e: MouseEvent) {
    // console.log("REDO");
    e.preventDefault();
    e.stopPropagation();
    const redoContent = this.base.historyManager.redo();
    const selection = this.base.exportSelection();
    if (redoContent) {
      // console.log("REDO", redoContent);
      this.base.setContent(redoContent.html);
      this.base.importSelection(redoContent.caret || selection);
    }
  },
  destroy() {
    this.off(this.button, 'click', this.handleClickBinded);
  },
});

(MediumEditor as any).extensions.redoButton = RedoButton;
