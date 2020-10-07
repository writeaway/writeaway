import { RedaxtorAPI } from '@writeaway/core';
import ReactDOM from 'react-dom';
import React from 'react';
import ImageManager from './ImageManager';

const lazy: { imageManager?: ImageManager, api?: RedaxtorAPI } = {};

const lazyGetImageManager = (api: RedaxtorAPI, container: Element) => {
  if (lazy.imageManager) {
    return lazy.imageManager;
  }
  lazy.api = api;
  const popupNode = document.createElement('redaxtor-image-manager');
  lazy.imageManager = ReactDOM.render(
    <ImageManager api={api} />,
    popupNode,
  ) as any; // TODO: This might break
  container.appendChild(popupNode);
  return lazy.imageManager;
};

export const imageManagerApi = (data: {api: RedaxtorAPI, container?: Element}) => {
  if (lazy.imageManager && lazy.api !== data.api) {
    console.error('Image manager is singleton-ish and can\'t be recreated with different API');
  }
  lazyGetImageManager(data.api, data.container || document.body);
  return lazy.imageManager;
};
