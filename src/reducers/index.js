import {combineReducers} from 'redux'
import C from '../constants'
import pieces from './pieces'
import pages from './pages'
import i18n from './i18n'
import images from './images'

const message = (message = null, action) => {
    switch (action.type) {
        case C.SHOW_MESSAGE:
            return action.options;
        default:
            return message
    }
};

const reducers = combineReducers({
    pieces, pages, i18n, message, images
});

export default reducers