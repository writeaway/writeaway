import { Dispatch, GetIWriteAwayState } from 'types';
import C from '../constants.js';

export const showMessage = (messageObject?: {content: string, type: string}) => ({ type: C.GLOBAL_SHOW_MESSAGE, message: messageObject });

export const navBarExpand = () => ({ type: C.NAVBAR_EXPAND });

export const navBarCollapse = () => ({ type: C.NAVBAR_COLLAPSE });

export const setExpert = (e: boolean) => ({ type: C.EXPERT_MODE, payload: e });

export const piecesToggleNavBar = () => (dispatch: Dispatch, getState: GetIWriteAwayState) => {
  const state = getState();

  if (state.global.navBarCollapsed) {
    dispatch(navBarExpand());
  } else {
    dispatch(navBarCollapse());
  }
};
