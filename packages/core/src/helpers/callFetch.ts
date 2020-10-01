import { showMessage } from '../actions';
import { getStore } from '../store';
import { toastr } from 'react-redux-toastr'; // TODO: It might be a good idea to extract it so it works without react context

export type FetchConfig = RequestInit & { url: string, data?: any };

const defaults: RequestInit = {
  method: 'POST',
  credentials: 'same-origin',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};

let instanceConfig: RequestInit = {};

export const configureFetch = (options: RequestInit) => {
  const headers = options.headers ? { ...defaults.headers, ...options.headers } : defaults.headers;
  instanceConfig = { ...options, headers };
};

export const callFetch = (options: FetchConfig) => {
  const noUrlMessage = 'undefined URL';
  let store = getStore();
  if (!options.url) {
    console.error('Called fetch with no URL', options);
    store.dispatch(showMessage({ content: noUrlMessage, type: 'error' }));
    return Promise.reject(noUrlMessage)
  }

  return fetch(options.url, {
    ...defaults,
    ...instanceConfig,
    body: options.data ? JSON.stringify(options.data) : undefined
  }).then(res => {
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.toLowerCase().indexOf('application/json') >= 0) {
      return res.json()
    } else {
      throw new TypeError()
    }
  }).then(res => {
    const status = res.status;
    if (status >= 200 && status < 300 || status === 304) {
      if (res.message) {
        const message = res.message,
          timeOut = message.timeout;
        toastr.success('', typeof message === 'object' ? message.content : message, timeOut ? { timeOut } : {});
      }
      const action = res.action || res.actions;
      // TODO: That is part of SF framework and should be handled there
      if (action) {
        const actionName = (typeof action === 'string') ? action : action.type;
        switch (actionName) {
          case 'redirect':
            const url = action.url;
            //http://stackoverflow.com/questions/10687099/how-to-test-if-a-url-string-is-absolute-or-relative
            self.location[/^(?:[a-z]+:)?\/\//i.test(url) ? 'href' : 'pathname'] = url;
            break;

          case 'reload':
          case 'refresh':
            location.reload();
            break;

          case 'close':
            self.close();
            break;
        }
      }
      return Promise.resolve(res)
    } else {
      throw new TypeError()
    }
  }).catch(error => {
    return Promise.reject(error)
  });
};

export default callFetch;
