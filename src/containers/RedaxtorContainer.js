import {connect} from 'react-redux';
import {showMessage} from '../actions';
import RedaxtorBarComponent from '../components/RedaxtorBar';

const mapStateToProps = (state) => {
    return {
        message: state.message
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        hideMessage: () => dispatch(showMessage(null))
    }
};

const RedaxtorBar = connect(
    mapStateToProps,
    mapDispatchToProps
)(RedaxtorBarComponent);

export default RedaxtorBar