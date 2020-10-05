import { Store } from 'types';

let store: Store | null = null;

// TODO: Use context instead?
export const setStore = (newStore: Store) => {
  store = newStore;
};

export const getStore = () => store;
