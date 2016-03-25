import {combineReducers} from 'redux'
import C from '../constants'
import pieces from './pieces'
import i18n from './i18n'

const edit = (edit = false, action) => {
    switch (action.type) {
        case C.TOGGLE_EDIT:
            return !edit
        default:
            return edit
    }
}

const currentSourcePieceId = (id = null, action) => {
    switch (action.type) {
        case C.SET_PIECE_CURRENT_SOURCE_ID:
            return action.id
        default:
            return id
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

const reducers = combineReducers({
    edit, highlight, pieces, pages, i18n, currentSourcePieceId
})

export default reducers

export function getData(state, id) {
    return state.pieces[id].data
}

export function getItems(state, id) {
    return state.pieces[id].data.items
}