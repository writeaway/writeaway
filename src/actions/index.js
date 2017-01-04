import C from "../constants"

export const showMessage = (messageObject) => {
    return {type: C.GLOBAL_SHOW_MESSAGE, message: messageObject} //TODO: Needs reducer handling this
};