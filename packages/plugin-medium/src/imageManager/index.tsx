import { RedaxtorAPI } from '@writeaway/core';
import ReactDOM from 'react-dom';
import React from 'react';
import ImageManager from './ImageManager';

const lazy: {
  rendred?: boolean,
  imageManager: ImageManager | null,
  api?: RedaxtorAPI,
  ref: Array<(manager: ImageManager | null) => void>
} = {
  imageManager: null, ref: [],
};

const lazyGetImageManager = (
  api: RedaxtorAPI,
  container: Element,
  ref: (manager: ImageManager | null) => void,
) => {
  if (lazy.rendred) {
    if (lazy.imageManager) {
      ref(lazy.imageManager);
    } else {
      lazy.ref.push(ref);
    }
    return;
  }
  lazy.ref.push(ref);
  lazy.api = api;
  const popupNode = document.createElement('redaxtor-image-manager');
  ReactDOM.render(
    <ImageManager
      api={api}
      ref={(inst) => {
        lazy.imageManager = inst;
        lazy.ref.forEach((r) => r(inst));
      }}
    />,
    popupNode,
  );
  container.appendChild(popupNode);
  lazy.rendred = true;
};

export const imageManagerApi = (data: {
  api: RedaxtorAPI,
  container?: Element,
  ref: (manager: ImageManager | null) => void
}) => {
  if (lazy.rendred && lazy.api !== data.api) {
    console.error('Image manager is singleton-ish and can\'t be recreated with different API');
  }
  lazyGetImageManager(data.api, data.container || document.body, data.ref);
};
