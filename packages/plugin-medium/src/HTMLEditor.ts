import { boundMethod } from 'autobind-decorator';
import MediumEditor from './mediumEditor';

export class HistoryManager {
  private history: any[];

  private historyIndex: number;

  public applied: boolean;

  public startState: any;

  constructor(start: any) {
    this.history = [];
    this.historyIndex = -1;
    this.applied = false;
    this.startState = start;
  }

  registerChange(content: any) {
    if (this.historyIndex >= 0 && this.history[this.historyIndex].html == content.html) {
      // console.log("Skipped pushing");
      return; // Don't register same text as current history position
    }

    if (this.historyIndex < this.history.length - 1) {
      // console.log("Deleting from ", this.historyIndex + 1);
      this.history.splice(this.historyIndex + 1);
    }

    this.history.push(content);
    this.historyIndex = this.history.length - 1;
    // console.log("Pushed ", this.history[this.historyIndex]);
  }

  undo() {
    this.applied = true;
    if (this.historyIndex > 0) {
      this.historyIndex--;
      // console.log("Undo from history", this.historyIndex, this.history[this.historyIndex], this.history);
      return this.history[this.historyIndex];
    }
    this.historyIndex = -1;
    // console.log("Undo from initial state", this.historyIndex, this.startState);
    return this.startState;
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.applied = true;
      // console.log("Redo from history", this.historyIndex, this.history[this.historyIndex], this.history);
      return this.history[this.historyIndex];
    }
    return void 0;
  }
}

export class HTMLEditor {
  private historyManager: HistoryManager;

  private options: any;

  public editor: any;

  private savedContent: any;

  private blurTimeout?: NodeJS.Timeout;

  private onNeedResizeCheckBinded: any;

  private startHTML?: string;

  private onChangeDebounced!: () => void;

  private onChangeDebounceTimer?: NodeJS.Timeout;

  constructor(node: HTMLElement, options: any) {
    this.historyManager = new HistoryManager(null);

    const defaults = {
      buttonLabels: 'fontawesome',
      autoLink: true,
      stickyTopOffset: 5,
      cleanPastedHTML: true,
      toolbar: {
        buttons: [
          'undo',
          'redo',
          {
            name: 'bold',
            action: 'bold',
            aria: options.i18n.button.bold,
            tagNames: ['b', 'strong'],
            style: {
              prop: 'font-weight',
              value: '700|bold',
            },
            useQueryState: true,
            contentDefault: '<b>B</b>',
            contentFA: '<i class="fa fa-bold"></i>',
          },
          {
            name: 'italic',
            action: 'italic',
            aria: options.i18n.button.italic,
            tagNames: ['i', 'em'],
            style: {
              prop: 'font-style',
              value: 'italic',
            },
            useQueryState: true,
            contentDefault: '<b><i>I</i></b>',
            contentFA: '<i class="fa fa-italic"></i>',
          },
          {
            name: 'underline',
            action: 'underline',
            aria: options.i18n.button.underline,
            tagNames: ['u'],
            style: {
              prop: 'text-decoration',
              value: 'underline',
            },
            useQueryState: true,
            contentDefault: '<b><u>U</u></b>',
            contentFA: '<i class="fa fa-underline"></i>',
          },
          {
            name: 'strikethrough',
            action: 'strikethrough',
            aria: options.i18n.button.strikethrough,
            tagNames: ['strike'],
            style: {
              prop: 'text-decoration',
              value: 'line-through',
            },
            useQueryState: true,
            contentDefault: '<s>A</s>',
            contentFA: '<i class="fa fa-strikethrough"></i>',
          },
          'colorPicker',
          'reset',
          'separator',
          {
            name: 'h1',
            action: 'append-h1',
            aria: options.i18n.button.h1,
            tagNames: ['h1'],
            contentDefault: '<b>H1</b>',
            contentFA: '<i class="fa fa-header"><sup>1</sup>',
          },
          {
            name: 'h2',
            action: 'append-h2',
            aria: options.i18n.button.h2,
            tagNames: ['h2'],
            contentDefault: '<b>H2</b>',
            contentFA: '<i class="fa fa-header"><sup>2</sup>',
          },
          {
            name: 'h3',
            action: 'append-h3',
            aria: options.i18n.button.h3,
            tagNames: ['h3'],
            contentDefault: '<b>H3</b>',
            contentFA: '<i class="fa fa-header"><sup>3</sup>',
          },
          {
            name: 'h4',
            action: 'append-h4',
            aria: options.i18n.button.h4,
            tagNames: ['h4'],
            contentDefault: '<b>H4</b>',
            contentFA: '<i class="fa fa-header"><sup>4</sup>',
          },
          'newLineSeparator',
          {
            name: 'unorderedlist',
            action: 'insertunorderedlist',
            aria: options.i18n.button.unorderedlist,
            tagNames: ['ul'],
            useQueryState: true,
            contentDefault: '<b>&bull;</b>',
            contentFA: '<i class="fa fa-list-ul"></i>',
          },
          {
            name: 'orderedlist',
            action: 'insertorderedlist',
            aria: options.i18n.button.orderedlist,
            tagNames: ['ol'],
            useQueryState: true,
            contentDefault: '<b>1.</b>',
            contentFA: '<i class="fa fa-list-ol"></i>',
          },
          {
            name: 'justifyFull',
            action: 'justifyFull',
            aria: options.i18n.button.justifyFull,
            tagNames: [],
            style: {
              prop: 'text-align',
              value: 'justify',
            },
            contentDefault: '<b>J</b>',
            contentFA: '<i class="fa fa-align-justify"></i>',
          },
          {
            name: 'justifyCenter',
            action: 'justifyCenter',
            aria: options.i18n.button.justifyCenter,
            tagNames: [],
            style: {
              prop: 'text-align',
              value: 'center',
            },
            contentDefault: '<b>C</b>',
            contentFA: '<i class="fa fa-align-center"></i>',
          },
          {
            name: 'justifyLeft',
            action: 'justifyLeft',
            aria: options.i18n.button.justifyLeft,
            tagNames: [],
            style: {
              prop: 'text-align',
              value: 'left',
            },
            contentDefault: '<b>L</b>',
            contentFA: '<i class="fa fa-align-left"></i>',
          },
          {
            name: 'justifyRight',
            action: 'justifyRight',
            aria: options.i18n.button.justifyRight,
            tagNames: [],
            style: {
              prop: 'text-align',
              value: 'right',
            },
            contentDefault: '<b>R</b>',
            contentFA: '<i class="fa fa-align-right"></i>',
          },
          'link',
          {
            name: 'quote',
            action: 'append-blockquote',
            aria: options.i18n.button.blockquote,
            tagNames: ['blockquote'],
            contentDefault: '<b>&ldquo;</b>',
            contentFA: '<i class="fa fa-quote-right"></i>',
          },
          'imageInsert',
          {
            name: 'pre',
            action: 'append-pre',
            aria: options.i18n.button.pre,
            tagNames: ['pre'],
            contentDefault: '<b>0101</b>',
            contentFA: '<i class="fa fa-code fa-lg"></i>',
          },
          'source',
          'save',
        ],
        static: true,
        updateOnEmptySelection: true,
        sticky: true,
      },
      extensions: {
        imageDragging: new MediumEditor.extensions.imageDrag(),
        // imageResize: new MediumEditor.extensions.imageResize(),
        redo: new MediumEditor.extensions.redoButton(),
        undo: new MediumEditor.extensions.undoButton(),
        reset: new MediumEditor.extensions.resetButton(),
        save: new MediumEditor.extensions.saveButton(),
        source: new MediumEditor.extensions.sourceButton(),
        imageInsert: new MediumEditor.extensions.imageInsertButton(),
        link: new MediumEditor.extensions.link(),
        separator: new MediumEditor.extensions.toolbarSeparator(),
        newLineSeparator: new MediumEditor.extensions.toolbarNewLineSeparator(),
        colorPicker: new MediumEditor.extensions.colorPicker({
          pickerColors: options.pickerColors,
        }),
      },
      anchor: {
        linkValidation: true,
        placeholderText: 'Paste or type a link',
        targetCheckbox: true,
        targetCheckboxText: 'Open in new window',
      },
      imageDragging: true,
    };

    this.options = {
      ...defaults,
      ...options,
    };

    this.editor = new MediumEditor(node, this.options);
    this.savedContent = null;
    if (!this.editor.elements[0]) {
      console.error('Could not create MediumEditor on node for unknown reason ', node);
      return;
    }

    this.onNeedResizeCheckBinded = options.onNeedResizeCheck.bind(this);

    this.startHTML = this.editor.getContent();
    this.editor.subscribe('focus', this.onFocus);
    this.editor.subscribe('blur', this.onBlur);
    this.editor.subscribe('save', this.save);
    this.editor.subscribe('setCurrentSourcePieceId', this.setCurrentSourcePieceId);
    this.editor.subscribe('onToggleImagePopup', this.options.onToggleImagePopup);

    this.editor.historyManager = this.historyManager;
    this.historyManager.startState = { html: this.editor.getContent(), caret: this.editor.exportSelection() };

    this.onChangeDebounceTimer = undefined;
    this.onChangeDebounced = () => {
      this.historyManager.registerChange({ html: this.editor.getContent(), caret: this.editor.exportSelection() });
    };
    this.editor.subscribe('editableInput', () => {
      this.onChange();
    });
    // Add separator class on li node
    const toolbarSeparators = this.editor.getExtensionByName('toolbar').toolbar.getElementsByClassName('separator');
    for (const index in toolbarSeparators) {
      toolbarSeparators[index].parentNode && toolbarSeparators[index].parentNode.classList.add('separator');
    }
    // Add new-line  and new-line class on li node
    const toolbarNewLineSeparators = this.editor.getExtensionByName('toolbar').toolbar.getElementsByClassName('newLineSeparator');
    for (const index in toolbarNewLineSeparators) {
      toolbarNewLineSeparators[index].parentNode && toolbarNewLineSeparators[index].parentNode.classList.add('new-line');
    }

    // pull right buttons
    Array.from(this.editor.getExtensionByName('toolbar').toolbar.getElementsByClassName('save-button')).forEach((element: any) => {
      element.parentNode && element.parentNode.classList.add('pull-right');
    });
    Array.from(this.editor.getExtensionByName('toolbar').toolbar.getElementsByClassName('reset-button')).forEach((element: any) => {
      element.parentNode && element.parentNode.classList.add('pull-right');
    });
  }

  @boundMethod
  onChange() {
    if (this.onChangeDebounceTimer) {
      clearTimeout(this.onChangeDebounceTimer);
    }
    if (this.historyManager.applied) {
      this.historyManager.applied = false; // Omit history event because it came from history manager
    } else {
      this.onChangeDebounceTimer = setTimeout(this.onChangeDebounced, 500);
    }

    this.options.onNeedResizeCheck();
  }

  getEditorContent() {
    if (this.editor) {
      return this.editor.getContent();
    }
    return this.savedContent;
  }

  saveData() {
    this.savedContent = this.editor ? this.editor.getContent() : this.savedContent;
  }

  needSave() {
    return this.getEditorContent() != this.startHTML;
  }

  @boundMethod
  save() {
    if (!this.needSave()) {
      return;
    }

    this.updatePiece();
    this.options.onSave && this.options.onSave();
    this.startHTML = this.getEditorContent();
  }

  @boundMethod
  setCurrentSourcePieceId() {
    this.options.onSetCurrentSourcePieceId && this.options.onSetCurrentSourcePieceId();
  }

  @boundMethod
  onFocus() {
    this.options.onFocus && this.options.onFocus();
    if (this.blurTimeout) {
      clearTimeout(this.blurTimeout);
    }
    this.options.onEditorActive && this.options.onEditorActive(true);
  }

  @boundMethod
  onBlur() {
    /**
     * We can send text update immediately
     */
    this.updatePiece();

    /**
     * Let blur event to settle before calling onLeave. If blur was produced by editor button click it will be followed by focus soon and we don't really need to react on it
     */
    this.blurTimeout = setTimeout(() => {
      if (this.needSave()) {
        this.options.onLeave && this.options.onLeave(() => {
          /**
           * This callback happens on data reset
           */
          this.editor && this.editor.setContent(this.startHTML);
          this.updatePiece();
        });
      } else {
        this.options.onLeave && this.options.onLeave();
      }
      this.options.onEditorActive && this.options.onEditorActive(false);
    }, 100);
  }

  removeListeners() {
    this.editor.unsubscribe('focus', this.onFocus);
    this.editor.unsubscribe('blur', this.onBlur);
    this.editor.getExtensionByName('undo').destroy();
    this.editor.getExtensionByName('save').destroy();
    this.editor.getExtensionByName('source').destroy();
  }

  updatePiece() {
    if (this.needSave()) {
      this.fixStyles();
      this.options.onUpdate && this.options.onUpdate();
    }
  }

  fixStyles() {

    /*
    const convertRgbToHex = (value) => (`0${parseInt(value).toString(16)}`).slice(-2);

    // insert inline styles
    const checkedStyleAttributes = ['font-family', 'font-size', 'font-weight', 'font-style', 'margin-top', 'margin-bottom', 'line-height', 'color'];
    const editDomString = this.editor.getContent();

    const domList = [].slice.call(this.editor.elements[0].children).filter((value) => value.nodeType !== 3); // it isn't text node

    const rootNode = document.createElement('div');
    rootNode.innerHTML = editDomString;
    [].slice.call(rootNode.childNodes).filter((value) => value.nodeType !== 3) // it isn't text node
      .forEach((node, nodeIndex) => {
        // fill inline styles
        const ownStyle = node.style;
        ownStyle && checkedStyleAttributes.forEach((attribute) => {
          if (!ownStyle[attribute]) {
            const computedStyle = window.getComputedStyle(domList[nodeIndex]); // take style from real element in DOM
            node.style[attribute] = computedStyle[attribute];
          }
        });

        // convert color rgb -> hex
        if (node.style && node.style.color) {
          // parses rgb / rgba
          const rgbData = /rgba?\((\d*),\s?(\d*),\s?(\d*)\)/gi.exec(node.style.color);
          // if it is correct then converts
          if (rgbData) {
            // !!! NOTE if use <element>.style.color = '#ffffff' or <element>.style.cssText = <some css string> than color converted to 'rgb(255,255,255)' automatically
            const hexColor = `#${convertRgbToHex(rgbData[1])}${convertRgbToHex(rgbData[2])}${convertRgbToHex(rgbData[3])}`;
            let inlineStyle = node.style.cssText;
            inlineStyle = inlineStyle.replace(node.style.color, hexColor);
            node.setAttribute('style', inlineStyle);
          }
        }
      });

    this.editor.setContent(editDomString); */
  }

  destroy() {
    if (this.editor) {
      this.saveData();
      this.editor.getExtensionByName('toolbar').destroy();
      this.editor.destroy();
      delete this.editor;
    } else {
      throw Error('Editor already destroyed');
    }
  }
}

export default HTMLEditor;
