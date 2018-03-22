import C from "../constants"

export const showMessage = (messageObject) => {
    return {type: C.GLOBAL_SHOW_MESSAGE, message: messageObject} //TODO: Needs reducer handling this
};

export const navBarExpand = () => ({type: C.NAVBAR_EXPAND});

export const navBarCollapse = () => ({type: C.NAVBAR_COLLAPSE});

export const setExpert = (e) => ({type: C.EXPERT_MODE, payload: e});

export const piecesToggleNavBar = () => (dispatch, getState) => {
    let state = getState();

    if(state.global.navBarCollapsed){
        dispatch(navBarExpand());
    } else {
        dispatch(navBarCollapse());
    }
};
