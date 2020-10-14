import Container from 'containers/connectPieceContainer';
import React from 'react';
import { useSelector } from 'react-redux';
import { IPieceControllerState, IWriteAwayState } from 'types';

export const PieceEditors = () => {
  const state: IPieceControllerState = useSelector((state: IWriteAwayState) => state.pieces);
  return (
    <>
      { Object.keys(state.byId).map((pieceId) => (<Container id={pieceId} key={pieceId} />)) }
    </>
  );
};
