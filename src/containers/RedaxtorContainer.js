import {connect} from 'react-redux';
import {showMessage} from '../actions';
import RedaxtorBarComponent from '../components/RedaxtorBar';

const mapStateToProps = (state) => {
    return {
        message: state.message,
        i18nTabVisible: Object.getOwnPropertyNames(state.i18n).length !== 0,
        piecesTabVisible: Object.getOwnPropertyNames(state.pieces).length !== 0,
        pagesTabVisible: (state.pages.list && state.pages.list.length) || state.pages.allowCreate,
        statement: state
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