import {combineReducers} from 'redux'
import C from '../constants'
import pieces from './pieces'

const edit = (edit = false, action) => {
    switch (action.type) {
        case C.TOGGLE_EDIT:
            return !edit
        default:
            return edit
    }
}

const highlight = (highlight = true, action) => {
    switch (action.type) {
        case C.TOGGLE_HIGHLIGHT:
            return !highlight
        default:
            return highlight
    }
}

const pages = (state = {}, action) => {
    return state
}

const i18n = (state = {}, action) => {
    return state
}

const reducers = combineReducers({
    edit, highlight, pieces, pages, i18n
})

export default reducers

export function getData(state, id) {
    return state.pieces[id].data
}

export function getItems(state, id) {
    return state.pieces[id].data.items
}