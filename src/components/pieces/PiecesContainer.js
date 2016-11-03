import {connect} from 'react-redux';
import PiecesComponent from './PiecesComponent';
import * as piecesActions from '../../actions/pieces';

/**
 * Map whole pieces state directly
 */
const mapStateToProps = (state) => {
    return state.pieces
};

const PiecesContainer = connect(
    mapStateToProps,
    piecesActions
)(PiecesComponent);

export default PiecesContainer;
