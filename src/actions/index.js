import C from "../constants"

export const toggleEdit = () => {
    return {type: C.TOGGLE_EDIT}
}

export const toggleHighlight = () => {
    return {type: C.TOGGLE_HIGHLIGHT}
}

export const showMessage = (options) => {
    return {type: C.SHOW_MESSAGE,options}
}

