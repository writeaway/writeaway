import React, { useMemo } from 'react';
import { IPieceItem } from 'types';
/* eslint-disable react/no-array-index-key */

export interface IPieceLineProps {
  piece: IPieceItem,
  editorActive: boolean,
  source: boolean,
  prevPieceName: string,
  pieceNameGroupSeparator: string,
  setSourceId: (pieceId: string) => void,
  activatePiece: (pieceId: string) => void,
  savePiece: () => void,
}

export const PieceLine = (
  {
    prevPieceName,
    pieceNameGroupSeparator,
    piece,
    activatePiece,
    editorActive,
    source,
    setSourceId,
    savePiece,
  }: IPieceLineProps,
) => {
  const { id } = piece;
  const hasActionOpen = true;

  const name = piece.name ? piece.name.split(pieceNameGroupSeparator) : [id];
  const prevName = prevPieceName ? prevPieceName.split(pieceNameGroupSeparator) : [];

  const label = useMemo(() => {
    let noOmit = true;

    return name.map((namePart, index) => {
      let omit = '';
      if (noOmit && (name.length > 1 && prevName.length > 1 && namePart === prevName[index])) {
        omit = 'omit';
      } else {
        noOmit = false; // Skip rest once met unmatch
      }
      return (
        <span
          className={`level-${name.length > 1 ? index : 1} ${omit}`}
          key={`${namePart}-${index}`}
        >
          {namePart}
        </span>
      );
    });
  }, [name, prevName]);

  return (
    <div className={`r_item-row r_item-type-${piece.type}`}>
      <div>
        <span className="r_item_name">
          {label}
        </span>
        <span className="r_item-right">
          {source && editorActive && piece.data && piece.data.html && !hasActionOpen
                        && <i aria-label="Edit Source" role="button" tabIndex={-1} className="rx_icon rx_icon-code r_btn" onClick={() => setSourceId(id)} />}

          {piece.changed && <i aria-label="Save" role="button" tabIndex={-1} className="r_icon-floppy r_btn" onClick={savePiece} />}

          {editorActive && piece.data && hasActionOpen
          && <i aria-label="Edit" role="button" tabIndex={-1} className="rx_icon rx_icon-mode_edit r_btn" onClick={() => activatePiece(id)} />}
        </span>
      </div>
      {piece.message
      && (
      <div
        role="button"
        tabIndex={-1}
        className={`r_item-message r_item-${piece.messageLevel}`}
        onClick={() => {
          if (piece.messageLevel === 'warning') {
            window.location.reload(); // TODO: Need better hack for that
          }
        }}
      >
        <b>{piece.message}</b>
      </div>
      )}
    </div>
  );
};
