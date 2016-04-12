import React, {Component} from "react"
import ReactDOM from "react-dom"
import {Provider, connect} from 'react-redux'
import {updatePiece, savePiece, setSourceId} from '../actions/pieces'
import {toggleImagePopup, setCancelCallback, setSaveCallback, saveImageData, resetImageData} from '../actions/images'

const PieceContainer = (props) => {
    let style = {width: "100%", height: "100%"};
    if (props.edit) style.outline = "2px dotted #3c93eb";
    return <props.component {...props} style={style} wrapper="div"/>
};

const mapStateToProps = (state, ownProps) => {
    return {
        ...state.pieces.byId[ownProps.id],
        highlight: state.pieces.highlight,
        edit: state.pieces.edit,
        images: state.images
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