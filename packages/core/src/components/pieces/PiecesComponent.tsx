import React, { useCallback, useEffect, useMemo } from 'react';
import {
  IComponent, IPieceItem, PieceType, IPiecesAPI,
} from 'types';
import PiecesList from './PiecesList';

import { RxCheckBox } from '../RxCheckBox';

import i18n from '../../i18n';

export interface IPiecesComponentProps {
  api: IPiecesAPI,
  editorRoot: HTMLElement,
  sourceId?: string,
  setSourceId: (id?: string) => void,
  savePiece: (id: string) => void,
  updatePiece: (id: string, update: any) => void,
  piecesToggleEdit: (piece?: PieceType) => void,
  piecesInit: () => void,
  byId: Record<string, IPieceItem>,
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
    editorRoot,
    setSourceId,
    savePiece,
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
    console.log('Here');
    const pieceProps = byId[sourceId];
    sourceEditor = (
      <components.source
        wrapper={editorRoot}
        expert={false}
        editorActive={editorActive}
        actions={{} as any}
        piece={pieceProps}
        api={api}
        onClose={() => setSourceId(undefined)}
        onSave={(id: string) => savePiece(id)}
      />
    );
  }

  return (
    <div>
      {sourceEditor}
      <div className="r_list-header-container">
        <div role="button" tabIndex={-1} className="r_list-header" onClick={toggleAllEditors}>
          <label htmlFor="fake">{i18n.bar.editAll}</label>
          <RxCheckBox checked={editorActive} />
        </div>
        {Object.keys(components).map((pieceType) => existingPieceTypes.has(pieceType) && (
        <div
          className={`r_list-header r_list-subheader r_list-subheader-${pieceType}`}
          key={pieceType}
          role="button"
          tabIndex={-1}
          onClick={() => piecesToggleEdit(pieceType as PieceType)}
        >
          <label htmlFor="fake">{components[pieceType as PieceType]!.label || pieceType}</label>
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
