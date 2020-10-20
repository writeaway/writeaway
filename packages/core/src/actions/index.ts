import { selectGlobal } from 'helpers/selectors';
import { Dispatch, GetIWriteAwayState, IComponent, IPiecesAPI, PieceType } from 'types';
import { Actions } from '../constants';

export const showMessage = (messageObject?: {content: string, type: string}) => ({ type: Actions.GLOBAL_SHOW_MESSAGE, message: messageObject });

export const navBarExpand = () => ({ type: Actions.NAVBAR_EXPAND });

export const navBarCollapse = () => ({ type: Actions.NAVBAR_COLLAPSE });

export const setExpert = (e: boolean) => ({ type: Actions.EXPERT_MODE, payload: e });

export const piecesToggleNavBar = () => (dispatch: Dispatch, getState: GetIWriteAwayState) => {
  const global = selectGlobal(getState);
  if (global.navBarCollapsed) {
    dispatch(navBarExpand());
  } else {
    dispatch(navBarCollapse());
  }
};

export const attachComponent = (type: PieceType, component: IComponent) => ({ type: Actions.ATTACH_COMPONENT, payload: { component, type } });

export const setAPI = (api: IPiecesAPI) => ({ type: Actions.SET_API, payload: api });
