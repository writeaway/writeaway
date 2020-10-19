import { AnyAction, combineReducers, Reducer } from 'redux';
import { reducer as toastr } from 'react-redux-toastr';
import { IGlobalState, IOptions } from 'types';
import { defaultGlobalState, defaultOptions } from '../defaults';

import { Actions, REDUCER_KEY } from '../constants';
import pieces from './pieces';

const global: Reducer<IGlobalState> = (state: IGlobalState = defaultGlobalState, action: AnyAction) => {
  switch (action.type) {
    case Actions.NAVBAR_COLLAPSE:
      return { ...state, navBarCollapsed: true };

    case Actions.NAVBAR_EXPAND:
      return { ...state, navBarCollapsed: false };

    case Actions.EXPERT_MODE:
      return { ...state, expert: action.payload };

    case Actions.GLOBAL_SHOW_MESSAGE:
      return { ...state, message: action.message };
    default:
      return state;
  }
};

export const writeAwayReducers = combineReducers({
  pieces, global, config: ((s: IOptions) => s || defaultOptions) as Reducer<IOptions>,
});

const defaultReducers = combineReducers({
  toastr, [REDUCER_KEY]: writeAwayReducers,
});

export default defaultReducers;
