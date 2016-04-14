import {combineReducers} from 'redux'
import {reducer as toastr} from 'react-redux-toastr'

import C from '../constants'
import pieces from './pieces'
import pages from './pages'
import i18n from './i18n'
import images from './images'

const reducers = combineReducers({
    pieces, pages, i18n, images, toastr
});

export default reducers