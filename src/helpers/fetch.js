var store = null;
import {showMessage} from '../actions'
var callFetch = function (options) {
    var noUrlMessage = 'undefined URL'
    if (!store && options.store) {
        store = options.store
    } else {
        if (!options.url) {
            store.dispatch(showMessage({content: noUrlMessage, type: "error"}));
            return Promise.reject(noUrlMessage)
        }
        return fetch(options.url, {
            method: "POST",
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: options.data ? JSON.stringify(options.data) : {}
        }).then(res => {
            if (res.headers.get("content-type") &&
                res.headers.get("content-type").toLowerCase().indexOf("application/json") >= 0) {
                return res.json()
            } else {
                throw new TypeError()
            }
        }).then(answer => {
            const status = answer.status;
            if (status >= 200 && status < 300 || status === 304) {
                if (answer.message) {
                    var message = answer.message;
                    typeof message !== 'object' && (message = {content: message});
                    store.dispatch(showMessage(message));
                }
                return Promise.resolve(answer)
            } else {
                throw new TypeError()
            }
        }).catch(error => {
            return Promise.reject(error)
        });
    }
};
module.exports = callFetch;
