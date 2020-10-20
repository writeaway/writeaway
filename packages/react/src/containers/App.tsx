import { WriteAwayEditors, WriteAwayNavBar, WriteAwayOverlay } from '@writeaway/core';
import { ReactPieceSourceCode } from '@writeaway/plugin-codemirror';
import { ReactPieceBlockBackground, ReactPieceImage, ReactPieceRichText } from '@writeaway/plugin-medium';
import { ReactPieceSeo } from '@writeaway/plugin-seo';
import * as React from 'react';
import { Provider } from 'react-redux';
import ReduxToastr from 'react-redux-toastr';
import { Store } from 'redux';

const codeStr = '<div>Block with editable source code. I.e. for tracking script tags or iframes</div>'
  + '<iframe width="560" height="315" src="https://www.youtube.com/embed/_F9EMbkvLBQ" '
  + 'frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
  + '';

export const App = ({ store }:{store: Store}) => (
  <>
    <Provider store={store}>
      <>
        <main>
          <ReactPieceBlockBackground
            id="bg-1"
            name="Background For Rich Text"
            bgColor="#FFcccc"
            className="p-4"
          >
            <article>
              <h2>Rich Text Block</h2>
              <ReactPieceRichText
                id="rich-1"
                name="Rich Text"
                html="<div>Editable Rich Text</div>"
              />
            </article>
          </ReactPieceBlockBackground>
          <ReactPieceBlockBackground
            id="bg-2"
            name="Background For Image"
            bgColor="#ccFFcc"
            className="p-4"
          >
            <article>
              <h2>Image Block</h2>
              <ReactPieceImage
                id="image-1"
                name="image"
                src="https://writeaway.github.io/images/image-06.jpg"
                title="Editable Image"
                alt="Sample Image"
              />
            </article>
          </ReactPieceBlockBackground>
          <ReactPieceBlockBackground
            id="bg-3"
            bgColor="#ccccff"
            name="Background For Source Code Block"
            className="p-4"
            src="https://writeaway.github.io/images/sayagata-400px.png"
          >
            <article>
              <h2>Source Code Block</h2>
              <ReactPieceSourceCode
                id="source-1"
                name="Source edit"
                html={codeStr}
                updateNode
              />
            </article>
          </ReactPieceBlockBackground>
          <article className="p-4">
            <h2>SEO data block</h2>
            <div className="btn">
              <ReactPieceSeo
                id="seo-1"
                name="SEO Data"
                label="Click to Edit SEO Meta Data"
                header="<meta></meta>"
                title="Page Title"
                description="Page Descriptions"
                keywords="Page Keywords"
              />
            </div>
          </article>
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
