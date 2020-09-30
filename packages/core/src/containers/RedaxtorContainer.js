import {connect} from 'react-redux';
import {showMessage, piecesToggleNavBar} from '../actions';
import RedaxtorBarComponent from '../components/RedaxtorBar';

const mapStateToProps = (state) => {
    return {
        message: state.message,
        enabled: state.pieces.editorActive,
        navBarCollapsed: state.global.navBarCollapsed,
        expert: state.global.expert,
        hoveredId: state.pieces.hoveredId,
        hoveredRect: state.pieces.hoveredRect,
        hoveredPiece: state.pieces.hoveredId ? state.pieces.byId[state.pieces.hoveredId] : null
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        hideMessage: () => dispatch(showMessage(null)),
        piecesToggleNavBar: () => dispatch(piecesToggleNavBar())
    }
};

const RedaxtorBar = connect(
    mapStateToProps,
    mapDispatchToProps
)(RedaxtorBarComponent);

export default RedaxtorBar