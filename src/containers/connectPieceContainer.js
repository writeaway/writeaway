import React, {Component} from "react"
import {connect} from 'react-redux'
import classNames from 'classnames';
import {updatePiece, savePiece, resetPiece, setSourceId} from '../actions/pieces'
import {getConfig} from '../config'

const PieceContainer = (props) => {
    return <props.component {...props} images={getConfig().images} className={classNames({
        "r_editor": true,
        "r_edit": props.editorActive,
        "r_highlight": props.editorActive
      })} wrapper="redaxtor"/>
};

const mapStateToProps = (state, ownProps) => {
    return {
        ...state.pieces.byId[ownProps.id],
        highlight: state.pieces.highlight,
        editorActive: state.pieces.editorActive
    };
};
const mapDispatchToProps = dispatch => {
    return {
        updatePiece: (id, piece) => dispatch(updatePiece(id, piece)),
        resetPiece: (id) => dispatch(resetPiece(id)),
        savePiece: (id) => dispatch(savePiece(id)),
        setCurrentSourcePieceId: id => dispatch(setSourceId(id))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PieceContainer);
