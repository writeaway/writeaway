import { PieceLine } from 'components/pieces/PieceLine';
import React from 'react';
import { IPieceState, PieceType } from 'types';

;

export interface IPiecesListProps {
  pieces: Record<string, IPieceState>,
  setSourceId: (id: string) => void,
  savePiece: (id: string) => void,
  pieceNameGroupSeparator: string,
  activatePiece: (id: string) => void,
  editorEnabled: Record<PieceType, boolean | undefined>
  editorActive: boolean,
  source: boolean,
}

export const PiecesList = (
  {
    pieces,
    editorEnabled,
    savePiece,
    activatePiece,
    source,
    setSourceId,
    pieceNameGroupSeparator,
    editorActive
  }: IPiecesListProps
) => {
  const ids = Object.keys(pieces);
  return (
    <div className="r_list">
      {ids.map((id, index) => {
          if (editorEnabled[pieces[id].type]) {
            const prevPieceName = index > 0 ? ids[index - 1] : '';

            return <PieceLine
              key={id}
              piece={pieces[id]}
              savePiece={() => savePiece(id)}
              activatePiece={activatePiece}
              source={source}
              setSourceId={setSourceId}
              pieceNameGroupSeparator={pieceNameGroupSeparator}
              prevPieceName={prevPieceName}
              editorActive={editorActive}/>
          } else {
            return null;
          }
        }
      )}
    </div>
  );
}
export default PiecesList
