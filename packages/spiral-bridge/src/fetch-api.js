require('whatwg-fetch');

/**
 * check status of response
 * @param {any} response
 * @return {any}
 */
function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        let error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}

/**
 * Perform a post data request to server with data to json serialization
 * @param {string} path
 * @param {*} data any data that can be wrapped in JSON.stringify
 * @return {Promise<TResult>}
 */
export function post(path, data) {
    return fetch(path, {
        method: 'post',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': window.csrfToken
        },
        body: JSON.stringify(data)
    })
        .then(checkStatus)
        .then((response) => response.json());
}

/**
 * Perform a postfile  request to server without data serialization
 * @param {string} path
 * @param {*} data any data that can be wrapped in JSON.stringify
 * @return {Promise<TResult>}
 */
export function postFile(path, data) {
    return fetch(path, {
        method: 'post',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'X-CSRF-TOKEN': window.csrfToken
        },
        body: data
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
export function get(path, data) {
    let appendGetData = [];
    if (data) {
        for (let key of data) {
            appendGetData.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
        }
    }
    return fetch(path + appendGetData.join('&'), {
        method: 'get',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': window.csrfToken
        },
    })
        .then(checkStatus)
        .then((response) => {
            return response.text().then(
                (text) => {
                    return text ? JSON.parse(text) : text;
                });
        });
}
