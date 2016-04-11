import C from '../constants'

const images = (image = {}, action) => {
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
            return {...image, isVisible: false, url:"", alt:"",width:"",height:""};
        case C.IMAGES_GET_STARTED:
            return {...image, loading: true};
        case C.IMAGES_GET_FINISHED:
            return {...image, gallery: action.list, loading: false};
        case C.PAGES_GET_ERROR:
            return {...image, error: action.error, loading: false};
        default:
            return image
    }
}

export default images;

