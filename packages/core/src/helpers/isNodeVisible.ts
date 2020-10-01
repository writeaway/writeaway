export const isNodeVisible = function (piece: unknown) {
  const computedStyle = getComputedStyle(piece.node);
  if (computedStyle.display === 'none' || computedStyle.opacity === 0) {
    return false;
  }
  return true;
};
