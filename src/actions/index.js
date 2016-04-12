import C from "../constants"

export const showMessage = (options) => {
    return {type: C.SHOW_MESSAGE,options}
}

