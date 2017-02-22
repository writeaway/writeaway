import {connect} from 'react-redux';
import {showMessage, piecesToggleNavBar} from '../actions';
import RedaxtorBarComponent from '../components/RedaxtorBar';

const mapStateToProps = (state) => {
    return {
        message: state.message,
        navBarCollapsed: state.global.navBarCollapsed
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