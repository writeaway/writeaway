import {connect} from 'react-redux';
import PiecesComponent from './PiecesComponent';
import * as actions from '../../actions/pieces';
import {toggleEdit, toggleHighlight} from '../../actions';

const mapStateToProps = (state) => {
    return {
        edit: state.edit,
        highlight: state.highlight,
        pieces: state.pieces,
        currentSourcePieceId: state.currentSourcePieceId
    }
};

const PiecesContainer = connect(
    mapStateToProps,
    {...actions, toggleEdit, toggleHighlight}
)(PiecesComponent);

export default PiecesContainer;
