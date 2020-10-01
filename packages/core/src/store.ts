import { Store } from 'redux';

let store: Store | null = null;

// TODO: Use context instead?
export const setStore = (newStore: Store) => {
    store = newStore
};

export const getStore = () => {
    return store;
};
