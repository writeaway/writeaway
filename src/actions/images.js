import C from "../constants"
import callFetch from '../helpers/fetch'

export const saveImageData = (data) => {
    return {type: C.SET_IMAGE_DATA, data}
}

export const toggleImagePopup = () => {
    return {type: C.TOGGLE_IMAGE_POPUP}
}

export const setCancelCallback = (callback) => {
    return {type: C.IMAGE_SET_CANCEL_CALLBACK, callback}
}

export const setSaveCallback = (callback) => {
    return {type: C.IMAGE_SET_SAVE_CALLBACK, callback}
}

export const resetImageData = () => {
    return {type: C.RESET_IMAGE_DATA}
}

export const getImages = () => {
    return (dispatch, getState) => {
        dispatch(imagesGetStarted());
        const images = getState().images;
        return callFetch({url: images.getImages}).then(res => {
            dispatch(imagesGetFinished(res.data.list));
        }).catch(error => {
            dispatch(imagesGetError(error));
        });
    }
};

export const imagesGetFinished = list => {
    return {type: C.IMAGES_GET_FINISHED, list}
};

export const imagesGetStarted = () => {
    return {type: C.IMAGES_GET_STARTED}
};

export const imagesGetError = (error) => {
    return {type: C.IMAGES_GET_ERROR, error}
};