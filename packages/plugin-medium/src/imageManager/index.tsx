import { RedaxtorAPI } from '@writeaway/core';
import ImageManager from './ImageManager'
import ReactDOM from 'react-dom';
import React, { Component } from 'react'

const lazy: { imageManager?: ImageManager, api?: RedaxtorAPI } = {};

const lazyGetImageManager = (api: RedaxtorAPI, container: Element) => {
  if (lazy.imageManager) {
    return lazy.imageManager;
  }
  lazy.api = api;
  const popupNode = document.createElement('redaxtor-image-manager');
  lazy.imageManager = ReactDOM.render(
    <ImageManager api={api}/>,
    popupNode
  );
  container.appendChild(popupNode);
  return lazy.imageManager;
};

const init = (data) => {
  if (lazy.imageManager && lazy.api != data.api) {
    console.error('Image manager is singleton-ish and can\'t be recreated with different API')
  }
  lazyGetImageManager(data.api, data.container || document.body);
};

const get = () => {
  return lazy.imageManager;
};

export const imageManagerApi = {
  get: get,
  init: init
};
