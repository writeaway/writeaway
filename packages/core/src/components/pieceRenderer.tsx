import { hasRemovedPiece } from 'actions/pieces';
import Container from 'containers/connectPieceContainer';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { getStore } from 'store';
import { Dispatch, GetIWriteAwayState, IPieceItemState } from 'types';

export const pieceUnmount = (piece: IPieceItemState) => (dispatch: Dispatch, getState: GetIWriteAwayState) => {
  if (piece.node.__rdxContainderNode) {
    ReactDOM.unmountComponentAtNode(piece.node.__rdxContainderNode);
    dispatch(hasRemovedPiece(piece.id));
  }
};
export const pieceRender = (piece: IPieceItemState) => {
  // let ComponentClass = getState().config.pieces.components[piece.type];
  let mainNode = document.querySelector('redaxtor-react-container');
  if (!mainNode) {
    mainNode = document.createElement('redaxtor-react-container');
    document.body.appendChild(mainNode);
  }
  const containerNode = document.createElement('redaxtor-editor');

  // Add few attributes. They are used only for visual information in browser inspector
  containerNode.setAttribute('rx:id', piece.id);
  containerNode.setAttribute('rx:type', piece.type);
  mainNode.appendChild(containerNode);
  piece.node.__rdxContainderNode = containerNode;
  return ReactDOM.render(
    <Provider store={getStore()}>
      <Container
        id={piece.id}
        component={getStore()!.getState().config.pieces.components[piece.type]}
        targetNode={piece.node}
      />
    </Provider>, containerNode, (ref) => {
      piece.node.__rdxRef = ref;
    },
  );
};
