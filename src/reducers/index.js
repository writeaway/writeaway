import {combineReducers} from 'redux'
import {reducer as toastr} from 'react-redux-toastr'

import C from '../constants'
import pieces from './pieces'
import pages from './pages'
import i18n from './i18n'

const global = (state = {}, action) => {
    switch (action.type) {
        case C.GLOBAL_SHOW_MESSAGE:
            return {...state, message: action.message};
        default:
            return state
    }
};

const reducers = combineReducers({
    pieces, pages, i18n, toastr, global
});


export default reducers