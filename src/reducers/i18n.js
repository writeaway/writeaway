import C from '../constants'

const i18n = (i18n = {}, action) => {
    switch (action.type) {
        // case C.I18N_ADD:
        //     return {...i18n, ...{[action.id]: action.i18n}};
        case C.I18N_SET_ELEMENTS:
            return {...i18n, elements: action.elements};
        // case C.I18N_TOGGLE_EDIT:
        //     return {...i18n, edit: !i18n.edit};
        case C.I18N_ENABLE_EDIT:
            return {...i18n, editorActive: true};
        case C.I18N_DISABLE_EDIT:
            return {...i18n, editorActive: false};
        case C.I18N_UPDATE_DATA:
            return {...i18n, data: {...i18n.data, [action.id]: action.value}};
        default:
            return i18n
    }
};

export default i18n;


