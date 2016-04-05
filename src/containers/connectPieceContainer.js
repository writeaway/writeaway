import React, {Component} from "react"
import ReactDOM from "react-dom"
import {Provider, connect} from 'react-redux'
import {updatePiece, savePiece, setCurrentSourcePieceId} from '../actions/pieces'

const PieceContainer = (props) => {//https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
    let style = {width: "100%", height: "100%"};
    if (props.edit) style.outline = "2px dotted #3c93eb";
    return <props.component {...props} style={style} wrapper="div"/>
};

const connectPieceContainer = (Component, id) => {
    const mapStateToProps = state => {
        return {
            data: state.pieces[id].data,
            highlight: state.highlight,
            edit: state.edit
        }
    };
    const mapDispatchToProps = dispatch => {
        return {
            updatePiece: (id, piece) => dispatch(updatePiece(id, piece)),
            savePiece: (id) => dispatch(savePiece(id)),
            setCurrentSourcePieceId: id => dispatch(setCurrentSourcePieceId(id))
        }
    };

    return connect(mapStateToProps, mapDispatchToProps)(Component)
};

export const initPiece = (store, PieceComponent, piece) => {

    let ConnectedPieceContainer = connectPieceContainer(PieceContainer, piece.id);

    ReactDOM.render(
        <Provider store={store}>
            <ConnectedPieceContainer id={piece.id} type={piece.type} node={piece.node} component={PieceComponent}/>
        </Provider>, piece.node);
};

export default connectPieceContainer