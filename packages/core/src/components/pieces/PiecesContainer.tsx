import {connect} from 'react-redux';
import { IWriteAwayState } from 'types';
import PiecesComponent from './PiecesComponent';
import * as piecesActions from '../../actions/pieces';

const mapStateToProps = (state: IWriteAwayState) => {
    return state.pieces
};

const PiecesContainer = connect(
    mapStateToProps,
    piecesActions
)(PiecesComponent);

export default PiecesContainer;
