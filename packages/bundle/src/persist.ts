/**
 * Set cookies
 * @param {string} name
 * @param {*} value
 */
export const setCookie = (name: string, value: string) => {
  const options: any = {};

  const newValue = encodeURIComponent(value);

  let updatedCookie = `${name}=${newValue}`;

  // eslint-disable-next-line no-restricted-syntax
  for (const propName in options) {
    // eslint-disable-next-line no-prototype-builtins
    if (options.hasOwnProperty(propName)) {
      updatedCookie += `; ${propName}`;
      const propValue = options[propName];
      if (propValue !== true) {
        updatedCookie += `=${propValue}`;
      }
    }
  }

  document.cookie = updatedCookie;
};

/**
 * Gets a document cookies
 * @param {string} name
 * @return {*}
 */
export const getCookie = (name: string) => {
  const matches = document.cookie.match(new RegExp(
    `(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`,
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
};

export const globMeta = () => {
  return (window as any).metadata as ({[id: string]: string} | undefined);
};

export const VAR_E_ACTIVE = 'r_editorActive';

export const VAR_E_COLLAPSED = 'r_navBarCollapsed';

export const VAR_E_EXPERT = 'r_expert';

export const VAR_WA = 'writeaway';
