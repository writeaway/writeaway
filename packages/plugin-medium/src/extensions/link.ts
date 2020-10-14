import * as MediumEditor from 'medium-editor';

export const Link = (MediumEditor as any).extensions.form.extend({
  /* Anchor Form Options */

  /* customClassOption: [string]  (previously options.anchorButton + options.anchorButtonClass)
   * Custom class name the user can optionally have added to their created links (ie 'button').
   * If passed as a non-empty string, a checkbox will be displayed allowing the user to choose
   * whether to have the class added to the created link or not.
   */
  customClassOption: null,

  /* customClassOptionText: [string]
   * text to be shown in the checkbox when the __customClassOption__ is being used.
   */
  customClassOptionText: 'Button',

  /* linkValidation: [boolean]  (previously options.checkLinkFormat)
   * enables/disables check for common URL protocols on anchor links.
   */
  linkValidation: false,

  /* placeholderText: [string]  (previously options.anchorInputPlaceholder)
   * text to be shown as placeholder of the anchor input.
   */
  placeholderText: 'URL: http://example.com/link',

  /* urlInputText: [string]
   * text to be shown as the label of the anchor input.
   */
  urlInputText: 'URL:',

  /* placeholderRelText: [string]
   * text to be shown as placeholder of the rel input.
   */
  placeholderRelText: 'Rel attribute: nofollow external',

  /* relInputText: [string]
   * text to be shown as the label of the rel input.
   */
  relInputText: 'Rel:',

  /* targetCheckbox: [boolean]  (previously options.anchorTarget)
   * enables/disables displaying a "Open in new window" checkbox, which when checked
   * changes the `target` attribute of the created link.
   */
  targetCheckbox: true,

  /* targetCheckboxText: [string]  (previously options.anchorInputCheckboxLabel)
   * text to be shown in the checkbox enabled via the __targetCheckbox__ option.
   */
  targetCheckboxText: 'Open in new window',

  /* excludeCheckbox: [boolean]
   * enables/disables displaying a "Exclude url from search engines" checkbox, which when checked
   * changes the `nofollow` attribute of the created link.
   */
  excludeCheckbox: true,

  /* excludeCheckboxText: [string]
   * text to be shown in the checkbox enabled via the __excludeCheckbox__ option.
   */
  excludeCheckboxText: 'Prevent search crawlers from following this link',

  // Options for the Button base class
  name: 'link',
  action: 'createLink',
  aria: 'Edit Link',
  tagNames: ['a'],
  contentDefault: '<b>#</b>',
  contentFA: '<i class="rx_icon rx_icon-chain"></i>',

  init() {
    (MediumEditor as any).extensions.form.prototype.init.apply(this, arguments);

    this.subscribe('editableKeydown', this.handleKeydown.bind(this));
  },

  // Called when the button the toolbar is clicked
  // Overrides ButtonExtension.handleClick
  handleClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const range = (MediumEditor as any).selection.getSelectionRange(this.document);
    let opts: any = { url: '' };

    if (range.startContainer.nodeName.toLowerCase() === 'a'
      || range.endContainer.nodeName.toLowerCase() === 'a'
      || (MediumEditor as any).util.getClosestTag((MediumEditor as any).selection.getSelectedParentElement(range), 'a')) {
      const node: HTMLAnchorElement = (MediumEditor as any).util.getClosestTag((MediumEditor as any).selection.getSelectedParentElement(range), 'a');
      opts = {
        url: node.getAttribute('href'),
        target: node.target || '',
        rel: node.rel || '',
      };
      // return this.execAction('unlink');
    }

    if (!this.isDisplayed()) {
      this.showForm(opts);
    }

    return false;
  },

  // Called when user hits the defined shortcut (CTRL / COMMAND + K)
  handleKeydown(event: KeyboardEvent) {
    if ((MediumEditor as any).util.isKey(event, (MediumEditor as any).util.keyCode.K) && (MediumEditor as any).util.isMetaCtrlKey(event) && !event.shiftKey) {
      this.handleClick(event);
    }
  },

  // Called by medium-editor to append form to the toolbar
  getForm() {
    if (!this.form) {
      this.form = this.createForm();
    }
    return this.form;
  },

  getTemplate() {
    const template = [
      '<div class="medium-editor-toolbar-form-row">',
      `<input type="text" id="urlInput${this.getEditorId()}" class="medium-editor-toolbar-input" placeholder="`, this.placeholderText, '">',
    ];

    template.push(
      '<a href="#" class="medium-editor-button medium-editor-toolbar-save">',
      this.getEditorOption('buttonLabels') === 'fontawesome' ? '<i class="rx_icon rx_icon-check"></i>' : this.formSaveLabel,
      '</a>',
    );

    template.push('<a href="#" class="medium-editor-button medium-editor-toolbar-close">',
      this.getEditorOption('buttonLabels') === 'fontawesome' ? '<i class="rx_icon rx_icon-close"></i>' : this.formCloseLabel,
      '</a>');

    template.push('<a href="#" class="medium-editor-button medium medium-editor-toolbar-unlink" title="Unlink">', '<i class="rx_icon rx_icon-chain-broken"></i></a>');

    template.push('</div>'); // close tag for the <div class="medium-editor-toolbar-form-row">

    // the rel editor
    template.push('<div class="medium-editor-toolbar-form-row">');
    template.push(`<select id="relInput${this.getEditorId()}" class="medium-editor-toolbar-input">
                <option value="">No additional relationship value</option>
                <option value="noreferrer">'noreferrer' - Browser won't not send an HTTP referer header</option>
                <option value="prev">'prev' - Provides a link to the previous document in the series</option>
                <option value="next">'next' - Provides a link to the next document in the series</option>
                <option value="alternate">'alternate' - Alternate representation of the document</option>
                <option value="author">'author' - Author of the document</option>
                <option value="bookmark">'bookmark' - Permanent URL used for bookmarking</option>
                <option value="external">'external' - URL is not part of the same site</option>
                <option value="help">'help' - Link to a help document</option>
                <option value="noopener">'noopener' - Hyperlink won't not have an opener browsing context</option>                
                <option value="search">'search' - Links to a search tool for the document</option>
                <option value="tag">'tag' - A tag (keyword) for the current document</option>
            </select>`);
    template.push('</div>');

    // both of these options are slightly moot with the ability to
    // override the various form buildup/serialize functions.

    if (this.targetCheckbox) {
      // fixme: ideally, this targetCheckboxText would be a formLabel too,
      // figure out how to deprecate? also consider `fa-` icon default implcations.
      template.push(
        '<div class="medium-editor-toolbar-form-row">',
        `<input type="checkbox" id="targetCheckbox${this.getEditorId()}" class="medium-editor-toolbar-anchor-target">`,
        `<label for="targetCheckbox${this.getEditorId()}">`,
        this.targetCheckboxText,
        '</label>',
        '</div>',
      );
    }

    if (this.excludeCheckbox) {
      template.push(
        '<div class="medium-editor-toolbar-form-row">',
        `<input type="checkbox" id="excludeCheckbox${this.getEditorId()}" class="medium-editor-toolbar-anchor-exclude">`,
        `<label for="excludeCheckbox${this.getEditorId()}">`,
        this.excludeCheckboxText,
        '</label>',
        '</div>',
      );
    }

    if (this.customClassOption) {
      // fixme: expose this `Button` text as a formLabel property, too
      // and provide similar access to a `fa-` icon default.
      template.push(
        '<div class="medium-editor-toolbar-form-row">',
        '<input type="checkbox" id="anchorCheckbox" class="medium-editor-toolbar-anchor-button">',
        '<label for="anchorCheckbox">',
        this.customClassOptionText,
        '</label>',
        '</div>',
      );
    }

    return template.join('');
  },

  // Used by medium-editor when the default toolbar is to be displayed
  isDisplayed() {
    return (MediumEditor as any).extensions.form.prototype.isDisplayed.apply(this);
  },

  hideForm() {
    (MediumEditor as any).extensions.form.prototype.hideForm.apply(this);
    this.getInput().value = '';
  },

  showForm(opts: any) {
    const input = this.getInput();
    const relInput = this.getRelInput();
    const targetCheckbox = this.getAnchorTargetCheckbox();
    const excludeCheckbox = this.getAnchorExcludeCheckbox();
    const buttonCheckbox = this.getAnchorButtonCheckbox();
    const buttonUnlink = this.getUnlink();
    opts = opts || { url: '' };
    // TODO: This is for backwards compatability
    // We don't need to support the 'string' argument in 6.0.0
    if (typeof opts === 'string') {
      opts = {
        url: opts,
      };
    }
    if (opts.url) {
      input.style.width = 'calc(100% - 161px)'; // update input width pto place all the buttons in one line
      relInput.style.width = 'calc(100% - 161px)';
      buttonUnlink.style.display = 'inline-block';
    } else {
      input.style.width = 'calc(100% - 130px)';
      relInput.style.width = 'calc(100% - 130px)';
      buttonUnlink.style.display = 'none';
    }

    this.base.saveSelection();
    this.hideToolbarDefaultActions();
    (MediumEditor as any).extensions.form.prototype.showForm.apply(this);
    this.setToolbarPosition();

    input.value = opts.url;
    input.focus();

    const relValue = opts.rel ? opts.rel.split(' ') : [];
    const index = relValue.indexOf('nofollow');
    if (index >= 0) {
      relValue.splice(index, 1);
    }
    excludeCheckbox.checked = index >= 0;
    relInput.value = relValue.join(' ');

    // If we have a target checkbox, we want it to be checked/unchecked
    // based on whether the existing link has target=_blank
    if (targetCheckbox) {
      targetCheckbox.checked = opts.target === '_blank';
    }

    // If we have a custom class checkbox, we want it to be checked/unchecked
    // based on whether an existing link already has the class
    if (buttonCheckbox) {
      const classList = opts.buttonClass ? opts.buttonClass.split(' ') : [];
      buttonCheckbox.checked = (classList.indexOf(this.customClassOption) !== -1);
    }
  },

  // Called by core when tearing down medium-editor (destroy)
  destroy() {
    if (!this.form) {
      return false;
    }

    if (this.form.parentNode) {
      this.form.parentNode.removeChild(this.form);
    }

    delete this.form;
  },

  // core methods

  getFormOpts() {
    // no notion of private functions? wanted `_getFormOpts`
    const targetCheckbox = this.getAnchorTargetCheckbox();
    const relInput = this.getRelInput();
    const excludeCheckbox = this.getAnchorExcludeCheckbox();
    const buttonCheckbox = this.getAnchorButtonCheckbox();
    const opts: any = {
      url: this.getInput().value.trim(),
    };

    if (this.linkValidation) {
      opts.url = this.checkLinkFormat(opts.url);
    }

    opts.target = '_self';
    if (targetCheckbox && targetCheckbox.checked) {
      opts.target = '_blank';
    }

    opts.rel = relInput.value.trim(); // trim from input
    if (excludeCheckbox && excludeCheckbox.checked) {
      opts.rel += ' nofollow';
    }
    opts.rel = opts.rel.trim(); // trim for 'nofollow'

    if (buttonCheckbox && buttonCheckbox.checked) {
      opts.buttonClass = this.customClassOption;
    }

    return opts;
  },

  doFormSave() {
    const opts = this.getFormOpts();
    this.completeFormSave(opts);
  },

  completeFormSave(opts: any) {
    this.base.restoreSelection();
    const node = (MediumEditor as any).util.getClosestTag((MediumEditor as any).selection.getSelectedParentElement((MediumEditor as any).selection.getSelectionRange(this.document)), 'a');
    node && this.base.selectElement(node);

    this.execAction(this.action, opts);

    // a node an be crated after exec action. MediumEditor have no options to set the rel attribute
    const createdNode = (MediumEditor as any).util.getClosestTag((MediumEditor as any).selection.getSelectedParentElement((MediumEditor as any).selection.getSelectionRange(this.document)), 'a') || node;
    createdNode && (createdNode.rel = opts.rel);

    this.base.checkSelection();
  },

  checkLinkFormat(value: string) {
    // Matches any alphabetical characters followed by ://
    // Matches protocol relative "//"
    // Matches common external protocols "mailto:" "tel:" "maps:"
    const urlSchemeRegex = /^([a-z]+:)?\/\/|^(mailto|tel|maps):/i;
    // var te is a regex for checking if the string is a telephone number
    const telRegex = /^\+?\s?\(?(?:\d\s?\-?\)?){3,20}$/;
    if (telRegex.test(value)) {
      return `tel:${value}`;
    }
    // Check for URL scheme and default to http:// if none found
    return (urlSchemeRegex.test(value) ? '' : 'http://') + encodeURI(value);
  },

  doFormCancel() {
    this.base.restoreSelection();
    this.base.checkSelection();
  },

  // form creation and event handling
  attachFormEvents(form: HTMLFormElement) {
    const close = form.querySelector('.medium-editor-toolbar-close');
    const save = form.querySelector('.medium-editor-toolbar-save');
    const input = form.querySelector(`#urlInput${this.getEditorId()}.medium-editor-toolbar-input`);
    const relInput = form.querySelector(`#relInput${this.getEditorId()}.medium-editor-toolbar-input`);
    const unlink = form.querySelector('.medium-editor-toolbar-unlink');

    // Handle clicks on the form itself
    this.on(form, 'click', this.handleFormClick.bind(this));

    // Handle typing in the textbox
    this.on(input, 'keyup', this.handleTextboxKeyup.bind(this));

    // Handle close button clicks
    this.on(close, 'click', this.handleCloseClick.bind(this));

    // Handle save button clicks (capture)
    this.on(save, 'click', this.handleSaveClick.bind(this), true);

    // Handle unlink button clicks (capture)
    this.on(unlink, 'click', this.handleUnlinkClick.bind(this));
  },

  createForm() {
    const doc = this.document;
    const form = doc.createElement('div');

    // Anchor Form (div)
    form.className = 'medium-editor-toolbar-form medium-editor-link-form-toolbar';
    form.id = `medium-editor-toolbar-form-anchor-${this.getEditorId()}`;
    form.innerHTML = this.getTemplate();
    this.attachFormEvents(form);

    return form;
  },

  getInput() {
    return this.getForm().querySelector(`input#urlInput${this.getEditorId()}.medium-editor-toolbar-input`);
  },

  getRelInput() {
    return this.getForm().querySelector(`#relInput${this.getEditorId()}.medium-editor-toolbar-input`);
  },

  getUnlink() {
    return this.getForm().querySelector('.medium-editor-toolbar-unlink');
  },

  getAnchorTargetCheckbox() {
    return this.getForm().querySelector('.medium-editor-toolbar-anchor-target');
  },

  getAnchorExcludeCheckbox() {
    return this.getForm().querySelector('.medium-editor-toolbar-anchor-exclude');
  },

  getAnchorButtonCheckbox() {
    return this.getForm().querySelector('.medium-editor-toolbar-anchor-button');
  },

  getAnchorTargetCheckboxLabel() {
    return this.getForm().querySelector('.medium-editor-toolbar-anchor-target + label');
  },

  handleTextboxKeyup(event: KeyboardEvent) {
    // For ENTER -> create the anchor
    if (event.keyCode === (MediumEditor as any).util.keyCode.ENTER) {
      event.preventDefault();
      this.doFormSave();
      return;
    }

    // For ESCAPE -> close the form
    if (event.keyCode === (MediumEditor as any).util.keyCode.ESCAPE) {
      event.preventDefault();
      this.doFormCancel();
    }
  },

  handleFormClick(event: MouseEvent) {
    // make sure not to hide form when clicking inside the form
    event.stopPropagation();
  },

  handleSaveClick(event: MouseEvent) {
    // Clicking Save -> create the anchor
    event.preventDefault();
    this.doFormSave();
  },

  handleCloseClick(event: MouseEvent) {
    // Click Close -> close the form
    event.preventDefault();
    this.doFormCancel();
  },

  handleUnlinkClick(event: MouseEvent) {
    this.base.restoreSelection();
    const node = (MediumEditor as any).util.getClosestTag((MediumEditor as any).selection.getSelectedParentElement((MediumEditor as any).selection.getSelectionRange(this.document)), 'a');
    node && this.base.selectElement(node);
    this.execAction('unlink');
  },
});

(MediumEditor as any).extensions.link = Link;
