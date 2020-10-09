import * as MediumEditor from 'medium-editor';

export const UndoButton = (MediumEditor as any).Extension.extend({
  name: 'undo',
  init() {
    this.button = this.document.createElement('button');
    this.button.classList.add('medium-editor-action');
    this.button.innerHTML = '<i class="rx_icon rx_icon-undo"></i>';
    this.button.title = 'Undo Changes';
    this.handleClickBinded = this.handleClick.bind(this);
    this.on(this.button, 'click', this.handleClickBinded);
  },
  getButton() {
    return this.button;
  },
  handleClick(e: MouseEvent) {
    // console.log("UNDO");
    e.preventDefault();
    e.stopPropagation();
    const undoContent = this.base.historyManager.undo();
    const selection = this.base.exportSelection();
    if (undoContent) {
      // console.log("UNDO", undoContent);
      this.base.setContent(undoContent.html);
      this.base.importSelection(undoContent.caret || selection);
    }
  },
  destroy() {
    this.off(this.button, 'click', this.handleClickBinded);
  },
});

(MediumEditor as any).extensions.undoButton = UndoButton;
