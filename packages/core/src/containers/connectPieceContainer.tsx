import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames';
import {
  updatePiece,
  onEditorActive,
  onNodeResized,
  savePiece,
  setPieceMessage,
  resetPiece,
  setSourceId,
  onActivationSentPiece,
  onDeactivationSentPiece
} from '../actions/pieces';
import { getConfig } from '../config';

export type PieceProps<T> = {
  type: string,
  editorActive: boolean,
  expert: unknown,
  component: React.FC<T>
}

const PieceContainer = <T extends object = any>(props: PieceProps<T>) => {
  let pieceOptions = getConfig().options[props.type] || {};
  return <props.component
      {...props}
      api={getConfig().api}
      options={pieceOptions}
      className={classNames({
      'r_editor': true,
      'r_edit': props.editorActive,
      'r_highlight': props.editorActive,
      'rx_non-expert': !props.expert,
    })} wrapper={'redaxtor-' + props.type}
  />
};

const mapStateToProps = (state, ownProps) => {
  return {
    ...state.pieces.byId[ownProps.id],
    highlight: state.pieces.highlight,
    expert: state.global.expert,
    editorActive: !state.pieces.byId[ownProps.id].destroy
      && state.pieces.editorActive &&
      state.pieces[`editorEnabled:${state.pieces.byId[ownProps.id].type}`] !== false
    //Note strict comparison to false. Undefined is treated as true, TODO: make a selector or method for this
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onManualActivation: (id) => dispatch(onActivationSentPiece(id)),
    onManualDeactivation: (id) => dispatch(onDeactivationSentPiece(id)),
    updatePiece: (id, piece) => dispatch(updatePiece(id, piece)),
    resetPiece: (id) => dispatch(resetPiece(id)),
    savePiece: (id) => dispatch(savePiece(id)),
    onEditorActive: (id, active) => dispatch(onEditorActive(id, active)),
    onNodeResized: (id) => dispatch(onNodeResized(id)),
    setPieceMessage: (id, message, messageLevel) => dispatch(setPieceMessage(id, message, messageLevel)),
    setCurrentSourcePieceId: id => dispatch(setSourceId(id))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(PieceContainer);
