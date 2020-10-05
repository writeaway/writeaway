/**
 * Calculate node bounding rect and it's capture area (that is recommended to be with small padding to node rect)
 * If "hover" area not returned, only "node" area is used and it is assumed node fit is too tight to enable paddings
 * @param piece {RedaxtorPiece}
 * @param padding {number} padding to add. Optional. Defaults to 10.
 * @param piece.node {HTMLElement}
 * @param piece.type {string}
 * @returns {{hover: {ClientRect}, node: {ClientRect}}}
 */
import { IPiece, Rect } from 'types';

export const getNodeRect = function (piece: IPiece, padding: number = 10) {
  const node = piece.node.getBoundingClientRect();

  const hover: Rect = {
    left: node.left - padding,
    right: node.right + padding,
    top: node.top - padding,
    bottom: node.bottom + padding,
    width: node.width + padding * 2,
    height: node.height + padding * 2,
  };

  if (hover.left + window.scrollX < 0 || hover.top + window.scrollY < 0 || hover.width + hover.left + window.scrollX > document.body.scrollWidth || hover.height + hover.top + window.scrollY > document.body.scrollHeight) {
    return {
      node,
    };
  }
  return {
    node,
    hover,
  };
};
