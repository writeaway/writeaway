import React, { useCallback, useEffect, useMemo } from 'react';
import {
  IComponent, IPieceItemState, PieceType, RedaxtorAPI,
} from 'types';
import PiecesList from './PiecesList';

import { RxCheckBox } from '../RxCheckBox';

import i18n from '../../i18n';

export interface IPiecesComponentProps {
  api: RedaxtorAPI,
  sourceId?: string,
  setSourceId: (id?: string) => void,
  savePiece: (id: string) => void,
  updatePiece: (id: string, update: any) => void,
  piecesToggleEdit: (piece?: PieceType) => void,
  piecesInit: () => void,
  byId: Record<string, IPieceItemState>,
  components: Partial<Record<PieceType, IComponent>>,
  editorEnabled: Partial<Record<PieceType, boolean>>,
  editorActive: boolean,
  activatePiece: (id: string) => void,
  pieceNameGroupSeparator: string,
}

export const PiecesComponent = (
  {
    api,
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
  }: IPiecesComponentProps,
) => {
  useEffect(() => {
    piecesInit();
  }, []);

  const savePieceFn = React.useCallback((html: string) => {
    if (sourceId) {
      updatePiece(sourceId, { data: { html } });
      savePiece(sourceId);
      setSourceId(undefined);
    }
  }, [updatePiece, savePiece, setSourceId, sourceId]);

  const toggleAllEditors = useCallback(() => {
    piecesToggleEdit(undefined);
  }, [piecesToggleEdit]);

  const existingPieceTypes = useMemo(() => {
    const result = new Set<string>();
    Object.keys(byId || {}).forEach((pieceId) => result.add(byId[pieceId].type));
    return result;
  }, [byId]); // TODO: not really memoizes anything right now, need to use keys

  let sourceEditor = null;
  if (components.source && sourceId) {
    const pieceProps = byId[sourceId];
    sourceEditor = (
      <components.source
        expert={false}
        editorActive={editorActive}
        actions={{} as any}
        piece={pieceProps}
        api={api}
        wrapper="redaxtor-modal"
        onClose={() => setSourceId(undefined)}
        onSave={(id: string) => savePiece(id)}
      />
    );
  }

  return (
    <div>
      {sourceEditor}
      <div className="r_list-header-container">
        <div className="r_list-header" onClick={toggleAllEditors}>
          <label>{i18n.bar.editAll}</label>
          <RxCheckBox checked={editorActive} />
        </div>
        {Object.keys(components).map((pieceType, index) => existingPieceTypes.has(pieceType) && (
        <div
          className={`r_list-header r_list-subheader r_list-subheader-${pieceType}`}
          key={index}
          onClick={() => piecesToggleEdit(pieceType as PieceType)}
        >
          <label>{components[pieceType as PieceType]!.name || pieceType}</label>
          <RxCheckBox
            checked={editorEnabled[pieceType as PieceType] ?? true}
            disabled={!editorActive}
          />
        </div>
        ))}
      </div>
      <PiecesList
        editorActive={editorActive}
        pieces={byId || {}}
        source={(editorEnabled.source ?? true) && !!components.source}
        editorEnabled={editorEnabled}
        setSourceId={setSourceId}
        activatePiece={activatePiece}
        pieceNameGroupSeparator={pieceNameGroupSeparator}
        savePiece={savePiece}
      />
    </div>
  );
};
