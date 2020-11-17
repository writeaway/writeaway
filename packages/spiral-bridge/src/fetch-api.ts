/**
 * check status of response
 * @param {any} response
 * @return {any}
 */
function checkStatus(response: Response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  (error as any).response = response;
  throw error;
}

/**
 * Perform a post data request to server with data to json serialization
 * @param {string} path
 * @param {*} data any data that can be wrapped in JSON.stringify
 * @return {Promise<Object>}
 */
export function post(path: string, data: any) {
  return fetch(path, {
    method: 'post',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': (window as any).csrfToken,
    },
    body: JSON.stringify(data),
  })
    .then(checkStatus)
    .then((response) => response.json());
}

/**
 * Perform a postfile  request to server without data serialization
 * @param {string} path
 * @param {*} data any data that can be wrapped in JSON.stringify
 * @return {Promise<Object>}
 */
export function postFile(path: string, data: FormData) {
  return fetch(path, {
    method: 'post',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'X-CSRF-TOKEN': (window as any).csrfToken,
    },
    body: data,
  })
    .then(checkStatus)
    .then((response) => response.json());
}

/**
 * Perform a get request to server
 * @param {string} path
 * @param {*} data flat object to onvert to URL-encoded string
 * @return {Promise<TResult>}
 */
export function get(path: string, data?: any) {
  const appendGetData: string[] = [];
  if (data) {
    Object.keys(data).forEach((key) => appendGetData.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`));
  }
  return fetch(`${path}?${appendGetData.join('&')}`, {
    method: 'get',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': (window as any).csrfToken,
    },
  })
    .then(checkStatus)
    .then((response) => response.text().then(
      (text) => (text ? JSON.parse(text) : text),
    ));
}
