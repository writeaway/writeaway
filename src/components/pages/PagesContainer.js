import {connect} from 'react-redux';
import Pages from './Pages';
import * as pagesActions from '../../actions/pages';

const mapStateToProps = (state) => {
    return state.pages
};

const PagesContainer = connect(
    mapStateToProps,
    pagesActions
)(Pages);

export default PagesContainer;
