import {connect} from 'react-redux';
import Pages from './Pages.js';
import * as pagesActions from '../../actions/pages.js';

const mapStateToProps = (state) => {
    return state.pages
};

/**
 * @deprecated
 */
const PagesContainer = connect(
    mapStateToProps,
    pagesActions
)(Pages);

export default PagesContainer;
