import MediumEditor from 'medium-editor';

import ('./extensions/resetButton');
import ('./extensions/undoButton');
import ('./extensions/redoButton');
import ('./extensions/saveButton');
import ('./extensions/sourceButton');
import ('./extensions/imageInsertButton');
import ('./extensions/link');
import ('./extensions/imageDrag');
import ('./extensions/ToolbarSeparator');
import ('./extensions/ToolbarNewLineSeparator');
import ('./extensions/ColorPicker');

const editor = MediumEditor as any;

editor.extensions.toolbar.prototype.positionStaticToolbar = function (container: HTMLElement) {
  // position the toolbar at left 0, so we can get the real width of the toolbar
  this.getToolbarElement().style.left = '0';

  // document.documentElement for IE 9
  const scrollTop = (this.document.documentElement && this.document.documentElement.scrollTop) || this.document.body.scrollTop;
  const windowWidth = this.window.innerWidth;
  const toolbarElement = this.getToolbarElement();
  const containerRect = this.base.options.__getBoundingRect();
  const containerTop = containerRect.top + scrollTop;
  const containerHeight = containerRect.height;
  const containerCenter = (containerRect.left + (containerRect.width / 2));
  const toolbarHeight = toolbarElement.offsetHeight;
  const toolbarWidth = toolbarElement.offsetWidth;
  const halfOffsetWidth = toolbarWidth / 2;
  const scrollTopBottom = toolbarHeight + scrollTop;
  const stickyOffsetTop = (this.options && this.options.stickyTopOffset) || 5;
  let targetLeft;

  toolbarElement.classList.add('redaxtor-medium-editor');

  if (this.sticky) {
    toolbarElement.classList.remove('medium-editor-on-top');
    toolbarElement.classList.remove('medium-editor-on-bottom');
    /**
     * If editor can't be fit on top before container, and there IS place under element, push it there
     */

    if (scrollTopBottom > containerTop - stickyOffsetTop && containerTop + containerHeight + toolbarHeight + stickyOffsetTop < scrollTop + window.innerHeight) {
      toolbarElement.style.top = `${containerTop + containerHeight + stickyOffsetTop}px`;
      toolbarElement.classList.remove('medium-editor-sticky-toolbar');
      toolbarElement.classList.add('medium-editor-on-bottom');
    } else
    // If it's beyond the height of the editor, position it at the bottom of the editor
    if (scrollTop > (containerTop + container.offsetHeight - toolbarHeight - stickyOffsetTop)) {
      toolbarElement.style.top = (containerTop + containerHeight - toolbarHeight) > 0 ? (containerTop + containerHeight - toolbarHeight) : `${scrollTop}px`;
      toolbarElement.classList.remove('medium-editor-sticky-toolbar');
    } else
    // Stick the toolbar to the top of the window
    if (scrollTop > (containerTop - toolbarHeight - stickyOffsetTop)) {
      toolbarElement.classList.add('medium-editor-sticky-toolbar');
      toolbarElement.style.top = `${stickyOffsetTop}px`;
    } else {
      toolbarElement.classList.remove('medium-editor-sticky-toolbar');
      toolbarElement.classList.add('medium-editor-on-top');
      toolbarElement.style.top = `${containerTop - toolbarHeight - stickyOffsetTop}px`;
    }
  } else {
    toolbarElement.style.top = `${containerTop - toolbarHeight}px`;
  }

  switch (this.align) {
    case 'left':
      targetLeft = containerRect.left;
      break;

    case 'right':
      targetLeft = containerRect.right - toolbarWidth;
      break;

    case 'center':
      targetLeft = containerCenter - halfOffsetWidth;
      break;

    default:
      break;
  }

  if (targetLeft < 0) {
    targetLeft = 0;
  } else if ((targetLeft + toolbarWidth) > windowWidth) {
    targetLeft = (windowWidth - Math.ceil(toolbarWidth) - 1);
  }

  toolbarElement.style.left = `${targetLeft}px`;
};

export default editor;
