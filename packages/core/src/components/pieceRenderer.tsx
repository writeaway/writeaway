import { hasRemovedPiece } from 'actions/pieces';
import Container from 'containers/connectPieceContainer';
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import { getStore } from 'store';
import { Dispatch, GetIWriteAwayState, IPieceItemState } from 'types';

export const pieceUnmount = (piece: IPieceItemState) => (dispatch: Dispatch, getState: GetIWriteAwayState) => {
  if ((piece as any).__rdxContainderNode) {  // TODO: Refactor
    ReactDOM.unmountComponentAtNode((piece as any).__rdxContainderNode);
    dispatch(hasRemovedPiece(piece.id));
  }
};
export const pieceRender = (piece: IPieceItemState) => {
  let mainNode = document.querySelector('redaxtor-react-container');
  if (!mainNode) {
    mainNode = document.createElement('redaxtor-react-container');
    document.body.appendChild(mainNode);
  }
  const containerNode: Element = document.createElement('redaxtor-editor');

  // Add few attributes. They are used only for visual information in browser inspector
  containerNode.setAttribute('rx:id', piece.id);
  containerNode.setAttribute('rx:type', piece.type);
  mainNode.appendChild(containerNode);
  (piece as any).__rdxContainerNode = containerNode; // TODO: Refactor
  const store = getStore();
  if(!store) {
    throw new Error('No store in instance');
  }
  const element: any = <Provider store={store}>
    <Container
      id={piece.id}
    />
  </Provider>;
  return ReactDOM.render(element, containerNode);
};
