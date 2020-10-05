import { IPieceItemState } from 'types';

export const isNodeVisible = function (piece: IPieceItemState) {
  const computedStyle = getComputedStyle(piece.node);
  if (computedStyle.display === 'none' || Number(computedStyle.opacity || '100') === 0) {
    return false;
  }
  return true;
};
