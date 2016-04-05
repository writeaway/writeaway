var store = null;
import {showMessage} from '../actions'
var callFetch = function (options) {
    var noUrlMessage = 'undefined URL';
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
        }).then(res => {
            const status = res.status;
            if (status >= 200 && status < 300 || status === 304) {
                if (res.message) {
                    var message = res.message;
                    typeof message !== 'object' && (message = {content: message});
                    store.dispatch(showMessage(message));
                }
                let action = res.action || res.actions;
                if (action) {
                    var actionName = (Object.prototype.toString.call(res.actions) === "[object Object]") ? action.type : action;
                    switch (actionName) {
                        case "redirect":
                            var url = action.url;
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
    }
};
module.exports = callFetch;
