import C from '../constants.js';

export const showMessage = (messageObject) => ({ type: C.GLOBAL_SHOW_MESSAGE, message: messageObject }) // TODO: Needs reducer handling this
;

export const navBarExpand = () => ({ type: C.NAVBAR_EXPAND });

export const navBarCollapse = () => ({ type: C.NAVBAR_COLLAPSE });

export const setExpert = (e) => ({ type: C.EXPERT_MODE, payload: e });

export const piecesToggleNavBar = () => (dispatch, getState) => {
  const state = getState();

  if (state.global.navBarCollapsed) {
    dispatch(navBarExpand());
  } else {
    dispatch(navBarCollapse());
  }
};
