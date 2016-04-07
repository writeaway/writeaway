import C from "../constants"

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
