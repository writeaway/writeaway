import C from "../constants"

export const showMessage = (text) => {
    return {type: C.GLOBAL_SHOW_MESSAGE, message: text} //TODO: Needs reducer handling this
};