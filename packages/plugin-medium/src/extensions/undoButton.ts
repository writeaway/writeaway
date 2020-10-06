import MediumEditor from 'medium-editor';

export const UndoButton = (MediumEditor as any).Extension.extend({
  name: 'undo',
  init: function () {
    this.button = this.document.createElement('button');
    this.button.classList.add('medium-editor-action');
    this.button.innerHTML = '<i class="rx_icon rx_icon-undo"></i>';
    this.button.title = 'Undo Changes';
    this.handleClickBinded = this.handleClick.bind(this);
    this.on(this.button, 'click', this.handleClickBinded);
  },
  getButton: function () {
    return this.button;
  },
  handleClick: function (e) {
    // console.log("UNDO");
    e.preventDefault();
    e.stopPropagation();
    let undoContent = this.base.historyManager.undo();
    let selection = this.base.exportSelection();
    if (undoContent) {
      // console.log("UNDO", undoContent);
      this.base.setContent(undoContent.html);
      this.base.importSelection(undoContent.caret || selection);
    }
  },
  destroy: function () {
    this.off(this.button, 'click', this.handleClickBinded);
  }
});

(MediumEditor as any).extensions.undoButton = UndoButton;
