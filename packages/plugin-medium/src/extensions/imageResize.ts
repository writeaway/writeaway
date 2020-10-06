import MediumEditor from 'medium-editor';

export const ImageResize = (MediumEditor as any).Extension.extend({
  init: function () {
    (MediumEditor as any).Extension.prototype.init.apply(this, arguments);
    this.subscribe('editableDrag', this.handleDrag.bind(this));
    this.subscribe('editableDrop', this.handleDrop.bind(this));
    this.base.origElements.addEventListener('dragstart', this.handleDragStart.bind(this));
  },
  handleDragStart: function (e: DragEvent) {
    const target = e.target as HTMLElement | null;
    (target?.tagName && target.tagName!.toLocaleLowerCase() === 'img') ? this.img = true : e.preventDefault();
  },
  handleDrag: function (event: DragEvent) {
    const target = event.target as HTMLElement | null;
    const className = 'medium-editor-dragover';
    if (event.type === 'dragover') {
      target?.classList.add(className);
    } else if (event.type === 'dragleave' && target?.classList) {
      target?.classList.remove(className);
    }
  },
  handleDrop: function (event: DragEvent) {
    const target = event.target as HTMLElement | null;
    const className = 'medium-editor-dragover';
    target?.classList.remove(className);
  }
});

(MediumEditor as any).extensions.imageResize = ImageResize;
