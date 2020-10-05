import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import {
  IPieceItemState, IWriteAwayState, Dispatch, IOptions,
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
  type: string,
  editorActive: boolean,
  expert: unknown,
  component: React.FC<T>,
  config: IOptions,
};

const PieceContainer = <T extends object = any>(props: PieceProps<T>) => {
  const pieceOptions = (props.config.options ? props.config.options[props.type] : undefined) || {};
  return (
    <props.component
      {...props}
      api={props.config.api}
      options={pieceOptions}
      className={classNames({
        r_editor: true,
        r_edit: props.editorActive,
        r_highlight: props.editorActive,
        'rx_non-expert': !props.expert,
      })}
      wrapper={`redaxtor-${props.type}`}
    />
  );
};

const mapStateToProps = (state: IWriteAwayState, ownProps: { id: string }) => ({
  ...state.pieces.byId[ownProps.id],
  highlight: state.pieces.highlight,
  expert: state.global.expert,
  config: state.config,
  editorActive: !state.pieces.byId[ownProps.id].destroy
    && state.pieces.editorActive
    && state.pieces.editorEnabled[state.pieces.byId[ownProps.id].type] !== false,
  // Note strict comparison to false. Undefined is treated as true, TODO: make a selector or method for this
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onManualActivation: (id: string) => dispatch(onActivationSentPiece(id)),
  onManualDeactivation: (id: string) => dispatch(onDeactivationSentPiece(id)),
  updatePiece: (id: string, piece: IPieceItemState) => dispatch(updatePiece(id, piece)),
  resetPiece: (id: string) => dispatch(resetPiece(id)),
  savePiece: (id: string) => dispatch(savePiece(id)),
  onEditorActive: (id: string, active: boolean) => dispatch(onEditorActive(id, active)),
  onNodeResized: (id: string) => dispatch(onNodeResized(id)),
  setPieceMessage: (id: string, message: string, messageLevel: string) => dispatch(setPieceMessage(id, message, messageLevel)),
  setCurrentSourcePieceId: (id: string) => dispatch(setSourceId(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PieceContainer);
