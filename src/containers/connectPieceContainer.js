import React, {Component} from "react"
import ReactDOM from "react-dom"
import {Provider, connect} from 'react-redux'
import classNames from 'classnames';
import {updatePiece, savePiece, setSourceId} from '../actions/pieces'
import {getConfig} from '../config'

/**
 * Container to render inline on page
 */
const PieceContainer = (props) => {
    return <props.component {...props} images={getConfig().images} className={classNames({
        "r_editable": true,
        "r_edit": props.edit,
        "r_highlight": props.edit
      })} wrapper="div"/>
};

const mapStateToProps = (state, ownProps) => {
    return {
        ...state.pieces.byId[ownProps.id],
        highlight: state.pieces.highlight,
        edit: state.pieces.edit
    };
};
const mapDispatchToProps = dispatch => {
    return {
        updatePiece: (id, piece) => dispatch(updatePiece(id, piece)),
        savePiece: (id) => dispatch(savePiece(id)),
        setCurrentSourcePieceId: id => dispatch(setSourceId(id)),
        toggleImagePopup: () => dispatch(toggleImagePopup()),
        setCancelCallback: callback => dispatch(setCancelCallback(callback)),
        setSaveCallback: callback => dispatch(setSaveCallback(callback)),
        saveImageData: data => dispatch(saveImageData(data)),
        resetImageData: () => dispatch(resetImageData())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PieceContainer);
