/**
 * Object serves as global config storage
 * TODO: This might be a bad idea, as initializing 2 Reduztor copies will kill this, so we don't really need that - can keep directly in react storage
 */
let Config = {};

export const setConfig = (config) => {
  Config = config;
};

export const getConfig = () => Config;
