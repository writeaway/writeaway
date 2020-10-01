import {connect} from 'react-redux';
import I18NComponent from './I18NComponent.js';
import * as actions from '../../actions/i18n.js';

const mapStateToProps = (state) => {
    return state.i18n
};

/**
 * @deprecated
 */
const I18NContainer = connect(
    mapStateToProps,
    actions
)(I18NComponent);

export default I18NContainer;
