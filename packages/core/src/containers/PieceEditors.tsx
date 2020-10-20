import Container from 'containers/connectPieceContainer';
import React from 'react';
import { useSelector } from 'react-redux';
import { IPieceControllerState, IWriteAwayStateExtension } from 'types';
import { REDUCER_KEY } from '../constants';

export const PieceEditors = () => {
  const state: IPieceControllerState = useSelector((s: IWriteAwayStateExtension) => s[REDUCER_KEY].pieces);
  return (
    <>
      { Object.keys(state.byId).map((pieceId) => (<Container id={pieceId} key={pieceId} />)) }
    </>
  );
};
