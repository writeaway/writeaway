import { WriteAwayEditors, WriteAwayNavBar, WriteAwayOverlay } from '@writeaway/core';
import { ReactPieceSourceCode } from '@writeaway/plugin-codemirror';
import { ReactPieceSeo } from '@writeaway/plugin-seo';
import * as React from 'react';
import { Provider } from 'react-redux';
import ReduxToastr from 'react-redux-toastr';
import { Store } from 'redux';

export const App = ({ store }:{store: Store}) => (
  <>
    <Provider store={store}>
      <>
        <main>
          <ReactPieceSourceCode
            id="source-1"
            name="Source edit"
            html="<div>Editable Source code</div>"
            updateNode={false}
          />
          <ReactPieceSeo
            id="seo-1"
            name="SEO Data"
            label="Click to Edit SEO Meta Data"
            header="<meta></meta>"
            title="Page Title"
            description="Page Descriptions"
            keywords="Page Keywords"
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
        <WriteAwayEditors />
        <ReduxToastr
          className="r_toast-container"
          timeOut={4000}
          position="top-right"
        />
      </>
    </Provider>
  </>
);
