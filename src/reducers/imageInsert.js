import C from '../constants'

const imageInsert = (image = {isVisible: false}, action) => {
    switch (action.type) {
        case C.SET_IMAGE_DATA:
            return {...image,...action.data};
        case C.TOGGLE_IMAGE_POPUP:
            return {...image, isVisible: !image.isVisible};
        case C.IMAGE_SET_CANCEL_CALLBACK:
            return {...image, onCancel: action.callback};
        case C.IMAGE_SET_SAVE_CALLBACK:
            return {...image, onSave: action.callback};
        case C.RESET_IMAGE_DATA:
            return {isVisible: false};
        default:
            return image
    }
}

export default imageInsert;

