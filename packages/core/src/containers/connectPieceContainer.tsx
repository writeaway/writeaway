import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import {
  IPieceItemState, IWriteAwayState, Dispatch, IOptions, IComponent, PieceActions,
} from 'types';
import {
  updatePiece,
  onEditorActive,
  onNodeResized,
  savePiece,
  setPieceMessage,
  resetPiece,
  setSourceId,
  onActivationSentPiece,
  onDeactivationSentPiece,
} from '../actions/pieces';

export type PieceProps<T> = {
  actions: PieceActions,
  editorActive: boolean,
  expert: boolean,
  piece: IPieceItemState,
  config: IOptions,
};

const PieceContainer = <T extends object = any>(props: PieceProps<T>) => {
  const pieceOptions = (props.config.options ? props.config.options[props.piece.type] : undefined) || {};
  const EditorComponent: IComponent | undefined = props.config.piecesOptions.components[props.piece.type];
  if (!EditorComponent) {
    throw new Error(`Piece type [${props.piece.type}] not supported`);
  }
  return (
    <EditorComponent
      piece={props.piece}
      actions={props.actions}
      expert={props.expert}
      editorActive={props.editorActive}
      api={props.config.api}
      options={pieceOptions}
      className={classNames({
        r_editor: true,
        r_edit: props.editorActive,
        r_highlight: props.editorActive,
        'rx_non-expert': !props.expert,
      })}
      wrapper={`redaxtor-${props.piece.type}`}
    />
  );
};

const mapStateToProps = (state: IWriteAwayState, ownProps: { id: string }) => ({
  piece: state.pieces.byId[ownProps.id],
  highlight: state.pieces.highlight,
  expert: state.global.expert,
  config: state.config,
  editorActive: !state.pieces.byId[ownProps.id].destroy
    && state.pieces.editorActive
    && (state.pieces.editorEnabled[state.pieces.byId[ownProps.id].type] ?? true),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: {
    onManualActivation: (id: string) => dispatch(onActivationSentPiece(id)),
    onManualDeactivation: (id: string) => dispatch(onDeactivationSentPiece(id)),
    updatePiece: (id: string, piece: Partial<IPieceItemState>) => dispatch(updatePiece(id, piece)),
    resetPiece: (id: string) => dispatch(resetPiece(id)),
    savePiece: (id: string) => dispatch(savePiece(id)),
    onEditorActive: (id: string, active: boolean) => dispatch(onEditorActive(id, active)),
    onNodeResized: (id: string) => dispatch(onNodeResized(id)),
    setPieceMessage: (id: string, message: string, messageLevel: string) => dispatch(setPieceMessage(id, message, messageLevel)),
    setCurrentSourcePieceId: (id: string) => dispatch(setSourceId(id)),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PieceContainer);
