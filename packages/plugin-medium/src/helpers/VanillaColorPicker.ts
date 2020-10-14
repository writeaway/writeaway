// ============================================================
//
// Vanilla Color Picker v 0.1.4
//
// http://github.com/miroshko/vanilla-color-picker
//
//
// This project is licensed under the terms of the MIT license.
//
// ============================================================
//
// Edited by SpiralScout

// eslint-disable-next-line max-classes-per-file
import { boundMethod } from 'autobind-decorator';

function singleColorTpl(color: string, index: number, picked: boolean, noColor?: string) {
  const pickedClass = picked ? 'vanilla-color-picker-single-color-picked' : '';
  if (color === 'noColor' && noColor) {
    return `<div class="vanilla-color-picker-single-color no-color ${pickedClass}" tabindex="${index}" data-color="${noColor}"></div>`;
  }
  return `<div class="vanilla-color-picker-single-color ${pickedClass}" tabindex="${index}" data-color="${color}" style="background-color:${color}"></div>`;
}

const DEFAULT_COLORS = ['red', 'yellow', 'green'];

class MessageMediator {
  subscribers: {[id: string]: any} = {};

  on(eventName: string, callback: Function) {
    this.subscribers[eventName] = this.subscribers[eventName] || [];
    this.subscribers[eventName].push(callback);
    return this;
  }

  emit(eventName: string, ...args: any[]) {
    (this.subscribers[eventName] || []).forEach((callback: Function) => {
      // eslint-disable-next-line prefer-spread
      callback.apply(null, args);
    });
  }
}

export class SinglePicker extends MessageMediator {
  public targetElem: HTMLElement;

  private elem: null | HTMLElement;

  constructor(elem: HTMLElement, private colors: string[], private className: string, private positionOnTop: boolean, private noColor?: string) {
    super();
    this.targetElem = elem;
    this.elem = null;
    this.initialize();
  }

  private initialize() {
    this.createPickerElement();
    this.positionPickerElement();
    this.addEventListeners();
  }

  destroy() {
    try {
      if (this.elem) {
        this.elem.parentNode!.removeChild(this.elem);
      }
    } catch (e) {
      // @see http://stackoverflow.com/a/22934552
    }
  }

  private positionPickerElement() {
    const left = this.targetElem.offsetLeft;
    const top = this.targetElem.offsetTop;
    const height = this.targetElem.offsetHeight;
    if (this.elem) {
      this.elem.style.left = `${left}px`;
      if (this.positionOnTop) {
        this.elem.style.left = `${this.targetElem.parentElement!.offsetLeft + this.targetElem.parentElement!.offsetWidth}px`;
        this.elem.style.top = `${this.targetElem.parentElement!.offsetTop + this.targetElem.parentElement!.offsetHeight - this.elem.offsetHeight}px`;
        // this.elem.style.top = (top - height - this.elem.offsetHeight) + 'px';
        // var posistionRealativeToWindow = this.elem.getBoundingClientRect(),
        //    topCorrection = posistionRealativeToWindow.top < 0 ? posistionRealativeToWindow.top : 0;
        // this.elem.style.top = parseInt(this.elem.style.top, 10) - topCorrection + 'px';
        /// / medium editor specific code, we have to modify color picker position
        /// / if this is too height and go beyond window
        // var activeToolbar = document.querySelector('.medium-editor-toolbar-active');
        // if (activeToolbar && topCorrection) {
        //    this.elem.style.left = activeToolbar.offsetWidth + 5 + 'px';
        // }
      } else {
        this.elem.style.top = `${top + height}px`;
      }
    }
  }

  @boundMethod
  private onFocusLost() {
    setTimeout(() => {
      if (document.activeElement && this.elem && this.elem.contains(document.activeElement)) {
        // because blur is not propagating
        document.activeElement.addEventListener('blur', this.onFocusLost);
      } else {
        this.emit('lostFocus');
      }
    }, 1);
  }

  private createPickerElement() {
    this.elem = document.createElement('div');
    this.elem.classList.add('vanilla-color-picker');
    if (this.className) {
      this.elem.classList.add(this.className);
    }

    const currentlyChosenColorIndex = this.colors.indexOf(this.targetElem.dataset.vanillaPickerColor!);

    for (let i = 0; i < this.colors.length; i += 1) {
      this.elem.innerHTML += singleColorTpl(this.colors[i], i + 1, i === currentlyChosenColorIndex, this.noColor);
    }
    this.targetElem.parentNode!.parentNode!.appendChild(this.elem);
    this.elem.setAttribute('tabindex', '1');

    const toFocus = currentlyChosenColorIndex > -1 ? currentlyChosenColorIndex : 0;

    (this.elem.children[toFocus] as HTMLElement).focus();
    this.elem.children[toFocus].addEventListener('blur', this.onFocusLost);
  }

  addEventListeners() {
    if (!this.elem) {
      return;
    }
    this.elem.addEventListener('click', (e) => {
      e.stopPropagation();
      const target = e.target as HTMLElement;
      if (target.classList.contains('vanilla-color-picker-single-color')) {
        this.emit('colorChosen', target.dataset.color);
      }
    });
    this.elem.addEventListener('keydown', (e) => {
      e.stopPropagation();
      const ENTER = 13;
      const ESC = 27;
      const keyCode = e.which || e.keyCode;
      const target = e.target as HTMLElement;
      if (keyCode === ENTER) {
        this.emit('colorChosen', target.dataset.color);
      }
      if (keyCode === ESC) {
        this.emit('lostFocus');
      }
    });
  }
}

export class PickerHolder extends MessageMediator {
  private colors: string[];

  private className: string;

  private currentPicker: null | SinglePicker;

  private positionOnTop: boolean;

  private noColor?: string;

  constructor(public elem: HTMLElement) {
    super();
    this.colors = DEFAULT_COLORS;
    this.className = '';
    this.currentPicker = null;
    this.positionOnTop = false;
    this.addEventListeners();
  }

  private addEventListeners() {
    this.elem.addEventListener('click', this.openPicker);
    this.elem.addEventListener('focus', this.openPicker);
    this.on('positionOnTop', () => {
      this.positionOnTop = true;
    });
    this.on('customColors', (colors: string[] | unknown) => {
      if (!Array.isArray(colors)) {
        throw new Error('Colors must be an array');
      }
      this.colors = colors;
    });
    this.on('defaultColor', (color: string) => {
      if (!this.elem.dataset.vanillaPickerColor) {
        this.updateElemState(color);
        this.emit('colorChosen', color, this.elem);
      }
    });
    this.on('noColor', (color: string) => {
      this.noColor = color;
    });
    this.on('className', (className: string) => {
      this.className = className;
    });
  }

  private updateElemState(color: string) {
    this.elem.dataset.vanillaPickerColor = color;
    (this.elem as any).value = color;
  }

  destroyPicker() {
    if (!this.currentPicker) {
      return;
    }
    this.currentPicker.destroy();
    this.currentPicker = null;
    this.emit('pickerClosed');
  }

  openPicker() {
    if (this.currentPicker) {
      return;
    }
    this.currentPicker = new SinglePicker(this.elem, this.colors, this.className, this.positionOnTop, this.noColor);
    this.currentPicker.on('colorChosen', (color: string) => {
      this.updateElemState(color);
      this.destroyPicker();
      this.emit('colorChosen', color, this.elem);
    });
    this.currentPicker.on('lostFocus', () => {
      this.destroyPicker();
    });
    this.emit('pickerCreated');
  }
}

function vanillaColorPicker(element: HTMLElement) {
  return new PickerHolder(element);
}

export default vanillaColorPicker;
