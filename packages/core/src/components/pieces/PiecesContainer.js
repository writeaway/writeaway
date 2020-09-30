import {connect} from 'react-redux';
import PiecesComponent from './PiecesComponent.js';
import * as piecesActions from '../../actions/pieces.js';

const mapStateToProps = (state) => {
    return state.pieces
};

const PiecesContainer = connect(
    mapStateToProps,
    piecesActions
)(PiecesComponent);

export default PiecesContainer;
