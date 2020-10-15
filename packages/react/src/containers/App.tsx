import { WriteAwayNavBar, WriteAwayOverlay } from '@writeaway/core';
import { WriteAwayReactCode } from '@writeaway/plugin-codemirror';
import * as React from 'react';
import { Provider } from 'react-redux';
import ReduxToastr from 'react-redux-toastr';
import { Store } from 'redux';

export const App = ({ store }:{store: Store}) => (
  <>
    <Provider store={store}>
      <>
        <main>
          <WriteAwayReactCode
            id="source-1"
            name="Source edit"
            html="<div>Editable Source code</div>"
            updateNode={false}
          />
        </main>
        <WriteAwayOverlay />
        <WriteAwayNavBar options={
          {
            navBarDraggable: true,
            navBarCollapsable: true,
            pieceNameGroupSeparator: ':',
          }
        }
        />
        <ReduxToastr
          className="r_toast-container"
          timeOut={4000}
          position="top-right"
        />
      </>
    </Provider>
  </>
);
