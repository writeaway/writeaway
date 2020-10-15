import { AnyAction, combineReducers, Reducer } from 'redux';
import { reducer as toastr } from 'react-redux-toastr';
import { IGlobalState, IOptions } from 'types';
import { defaultGlobalState, defaultOptions } from '../defaults';

import C, { REDUCER_KEY } from '../constants';
import pieces from './pieces';

const global: Reducer<IGlobalState> = (state: IGlobalState = defaultGlobalState, action: AnyAction) => {
  switch (action.type) {
    case C.NAVBAR_COLLAPSE:
      return { ...state, navBarCollapsed: true };

    case C.NAVBAR_EXPAND:
      return { ...state, navBarCollapsed: false };

    case C.EXPERT_MODE:
      return { ...state, expert: action.payload };

    case C.GLOBAL_SHOW_MESSAGE:
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
