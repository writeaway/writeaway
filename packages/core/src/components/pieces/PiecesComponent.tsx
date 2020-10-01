import React, { useCallback, useEffect, useMemo } from 'react';
import { IComponent, IPiece, IPieceState, PieceType } from 'types';
import PiecesList from './PiecesList';

import { RxCheckBox } from '../RxCheckBox';

import i18n from '../../i18n';

export interface IPiecesComponentProps {
  sourceId: string,
  setSourceId: (id?: string) => void,
  savePiece: (id: string) => void,
  updatePiece: (id: string, update: any) => void,
  piecesToggleEdit: (b: boolean) => void,
  piecesInit: () => void,
  byId: Record<string, IPieceState>,
  components: Record<PieceType, IComponent>,
  editorEnabled: Record<PieceType, boolean>,
  editorActive: boolean,
  activatePiece: (id: string) => void,
  pieceNameGroupSeparator: string,
}

export const PiecesComponent = (
  {
    sourceId,
    setSourceId,
    savePiece,
    updatePiece,
    piecesInit,
    piecesToggleEdit,
    pieceNameGroupSeparator,
    activatePiece,
    byId,
    editorEnabled,
    editorActive,
    components,
  }: IPiecesComponentProps) => {

  useEffect(() => {
    piecesInit();
  }, []);

  const savePieceFn = React.useCallback((html: string) => {
    updatePiece(sourceId, { data: { html: html } });
    savePiece(sourceId);
    setSourceId(undefined);
  }, [updatePiece, savePiece, setSourceId, sourceId]);

  const toggleAllEditors = useCallback(() => {
    piecesToggleEdit(false);
  }, [piecesToggleEdit]);

  const existingPieceTypes = useMemo(() => {
    const result = new Set<string>();
    Object.keys(byId || {}).forEach(pieceId => result.add(byId[pieceId].type));
    return result;
  }, [byId]); // TODO: not really memoizes anything right now, need to use keys


  var sourceEditor = null;
  if (components.source && sourceId) {
    sourceEditor = <components.source wrapper="redaxtor-modal"
                                      html={byId[sourceId].data.html}
                                      onClose={() => setSourceId(undefined)}
                                      onSave={(id: string) => savePiece(id)}/>
  }

  return (
    <div>
      {sourceEditor}
      <div className="r_list-header-container">
        <div className="r_list-header" onClick={toggleAllEditors}>
          <label>{i18n.bar.editAll}</label>
          <RxCheckBox checked={editorActive} />
        </div>
        {Object.keys(components).map((pieceType, index) =>
          existingPieceTypes.has(pieceType) && (
            <div className={'r_list-header r_list-subheader r_list-subheader-' + pieceType} key={index}
                 onClick={() => piecesToggleEdit(pieceType as PieceType)}>
              <label>{components[pieceType].name || pieceType}</label>
              <RxCheckBox checked={editorEnabled[pieceType]}
                          disabled={!editorActive}
              />
            </div>)
        )}
      </div>
      <PiecesList editorActive={editorActive}
                  pieces={byId || {}}
                  source={editorEnabled.source && !!components.source}
                  editorEnabled={editorEnabled}
                  setSourceId={setSourceId}
                  activatePiece={activatePiece}
                  pieceNameGroupSeparator={pieceNameGroupSeparator}
                  savePiece={savePiece}
      />
    </div>
  )
}
