import React, {Component} from "react"
import ReactDOM from "react-dom"
import {Provider, connect} from 'react-redux'
import {updatePiece, savePiece, pieceGet} from '../actions'

const connectPieceContainer = (Component, id) => {
    const mapStateToProps = state => {
        return {
            data: state.pieces[id].data,
            highlight: state.highlight,
            edit: state.edit
        }
    }
    const mapDispatchToProps = dispatch => {
        return {
            updatePiece: (id, piece) => dispatch(updatePiece(id, piece)),
            savePiece: (id) => dispatch(savePiece(id))
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(Component)
}

export const initPiece = (store, PieceComponent, piece) => {
    piece.node.style.width = "100%";
    piece.node.style.height = "100%";

    let PieceContainer = connectPieceContainer(PieceComponent, piece.id)

    ReactDOM.render(
        <Provider store={store}>
            <PieceContainer id={piece.id} type={piece.type} node={piece.node}/>
        </Provider>, piece.node);
}

export default connectPieceContainer