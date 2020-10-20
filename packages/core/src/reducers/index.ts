import { AnyAction, combineReducers, Reducer } from 'redux';
import { reducer as toastr } from 'react-redux-toastr';
import {
  IComponent, IGlobalState, IOptions, PieceType,
} from 'types';
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

const config: Reducer<IOptions> = (state: IOptions = defaultOptions, action: AnyAction) => {
  switch (action.type) {
    case Actions.ATTACH_COMPONENT: {
      const component: IComponent | undefined = state.piecesOptions.components[action.payload.type as PieceType];
      if (!component) {
        return {
          ...state,
          piecesOptions: {
            ...state.piecesOptions,
            components: {
              ...state.piecesOptions.components,
              [action.payload.type]: action.payload.component,
            },
          },
        };
      }
      return state;
    }
    case Actions.SET_API: {
      const { api } = state;
      if (api !== action.payload && action.payload) {
        return {
          ...state,
          api: { ...api, ...action.payload },
        };
      }
      return state;
    }
    default:
      return state;
  }
};

export const writeAwayReducers = combineReducers({
  pieces, global, config,
});

const defaultReducers = combineReducers({
  toastr, [REDUCER_KEY]: writeAwayReducers,
});

export default defaultReducers;
