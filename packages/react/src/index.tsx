import { App } from 'containers/App';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { startStore } from 'startStore';
import './style.less';

const store = startStore();

const MOUNT_NODE = document.getElementById('app');

// eslint-disable-next-line react/no-render-return-value
const render = () => ReactDOM.render(<App store={store} />, MOUNT_NODE);

if (module.hot) {
  module.hot.accept(['containers/App'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE as HTMLElement);
    render();
  });
}

render();
