import {showMessage} from '../actions'
import {getStore} from '../store'
import {toastr} from 'react-redux-toastr'

let defaults = {
    method: "POST",
    credentials: 'same-origin',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
};

export const configureFetch = (options) => {
    const headers = options.headers ? {...defaults.headers, ...options.headers} : defaults.headers;
    defaults = {...defaults, ...options, headers}//TODO: This looks like rewriting defaults with type breaking
};

const callFetch = (options) => {
    var noUrlMessage = 'undefined URL';
    let store = getStore();
    if (!options.url) {
        console.error("Called fetch with no URL", options);
        store.dispatch(showMessage({content: noUrlMessage, type: "error"}));
        return Promise.reject(noUrlMessage)
    }

    return fetch(options.url, {
        ...defaults,
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
                var message = res.message,
                    timeOut = message.timeout,
                    settings = {};
                typeof message === 'object' && (message = message.content);
                timeOut && (settings.timeOut = timeOut);
                toastr.success("",message,settings);
            }
            let action = res.action || res.actions;
            if (action) {
                var actionName = (Object.prototype.toString.call(action) === "[object Object]") ? action.type : action;
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
};

export default callFetch;