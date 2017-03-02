import React, {Component} from "react"
import {connect} from 'react-redux'
import classNames from 'classnames';
import {updatePiece, onEditorActive, onNodeResized, savePiece, setPieceMessage, resetPiece, setSourceId, onActivationSentPiece, onDeactivationSentPiece} from '../actions/pieces'
import {getConfig} from '../config'

const PieceContainer = (props) => {
    let pieceOptions = getConfig().options[props.type] || {};
    return <props.component {...props} api={getConfig().api} options={pieceOptions} className={classNames({
        "r_editor": true,
        "r_edit": props.editorActive,
        "r_highlight": props.editorActive
      })} wrapper={"redaxtor-" + props.type}/>
};

const mapStateToProps = (state, ownProps) => {
    return {
        ...state.pieces.byId[ownProps.id],
        highlight: state.pieces.highlight,
        editorActive: !state.pieces.byId[ownProps.id].destroy && state.pieces.editorActive && state.pieces[`editorEnabled:${state.pieces.byId[ownProps.id].type}`]!==false //Note strict comparison to false. Undefined is treated as true
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
        setPieceMessage: (id, message, messageLevel) =>  dispatch(setPieceMessage(id, message, messageLevel)),
        setCurrentSourcePieceId: id => dispatch(setSourceId(id))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PieceContainer);
