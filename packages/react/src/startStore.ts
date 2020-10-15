import { reducer as toastr } from 'react-redux-toastr';
import {
  defaultState as writeAwayState,
  reducerKey as writeAwayReducerKey,
  reducer as writeAwayReducer,
  IWriteAwayState,
} from '@writeaway/core';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import { applyMiddleware, combineReducers, AnyAction, createStore, Reducer } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { IApplicationState } from 'types';

export const startStore = () => {
  const appReducer = (state: {} | undefined) => (state || {});

  /**
   * Configure reducers
   */
  const reducers = combineReducers({
    [writeAwayReducerKey as '@writeaway']: writeAwayReducer as Reducer<IWriteAwayState>, // add WriteAway reducer
    toastr, // Optionally add toastr reducer if you use react-redux-toastr. If not, handle react-redux-toastr actions manually in your app to show toasts from WriteAway
    app: appReducer, // Add application specific reducers
  });

  const defaultAppState = {};

  /**
   * Configure initial default state
   */
  const initialState: IApplicationState = {
    [writeAwayReducerKey]: writeAwayState as IWriteAwayState,
    toastr: undefined as any,
    app: defaultAppState,
  };

  // compose middleware
  const middlewares = [
    thunk as ThunkMiddleware, // WriteAway relies on thunk middleware
    // sagaMiddleware, // Add other middlewares if you need them
    // routerMiddleware(history)
  ];
  const enhancers = [applyMiddleware(...middlewares)];
  const store = createStore<IApplicationState, AnyAction, {}, unknown>(
    reducers,
    initialState,
    composeWithDevTools({
      name: 'WriteAway React Demo',
    })(...enhancers),
  );

  // Run custom middleware
  // sagaMiddleware.run(rootSaga);

  return store;
};
