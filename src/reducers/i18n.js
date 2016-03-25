import C from '../constants'

const i18n = (i18n = {}, action) => {
    switch (action.type) {
        case C.I18N_ADD:
            return {...i18n, ...{[action.id]: action.i18n}}
        default:
            return i18n
    }
}

export default i18n;


