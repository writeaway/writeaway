import { selectGlobal } from 'helpers/selectors';
import { Dispatch, GetIWriteAwayState, IComponent, PieceType } from 'types';
import C from '../constants';

export const showMessage = (messageObject?: {content: string, type: string}) => ({ type: C.GLOBAL_SHOW_MESSAGE, message: messageObject });

export const navBarExpand = () => ({ type: C.NAVBAR_EXPAND });

export const navBarCollapse = () => ({ type: C.NAVBAR_COLLAPSE });

export const setExpert = (e: boolean) => ({ type: C.EXPERT_MODE, payload: e });

export const piecesToggleNavBar = () => (dispatch: Dispatch, getState: GetIWriteAwayState) => {
  const global = selectGlobal(getState);
  if (global.navBarCollapsed) {
    dispatch(navBarExpand());
  } else {
    dispatch(navBarCollapse());
  }
};

export const attachComponent = (type: PieceType, component: IComponent) => ({ type: C.EXPERT_MODE, payload: { component, type } });
