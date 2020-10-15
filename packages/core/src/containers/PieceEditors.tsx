import Container from 'containers/connectPieceContainer';
import React from 'react';
import { useSelector } from 'react-redux';
import { IPieceControllerState, IWriteAwayStateExtension } from 'types';

export const PieceEditors = () => {
  const state: IPieceControllerState = useSelector((s: IWriteAwayStateExtension) => s['@writeaway'].pieces);
  return (
    <>
      { Object.keys(state.byId).map((pieceId) => (<Container id={pieceId} key={pieceId} />)) }
    </>
  );
};
