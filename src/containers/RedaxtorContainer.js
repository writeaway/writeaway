import {connect} from 'react-redux';
import {toggleEdit, toggleHighlight, savePieces, updatePiece, savePiece, setCurrentSourcePieceId} from '../actions';
import {savePage, pageStartCreating} from '../actions/pages';
import RedaxtorBarComponent from '../components/RedaxtorBar';

const mapStateToProps = (state) => {
    return {
        edit: state.edit,
        highlight: state.highlight,
        pieces: state.pieces,
        currentSourcePieceId: state.currentSourcePieceId,
        
        pages: state.pages
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleToggleEdit: () => dispatch(toggleEdit()),
        handleToggleHighlight: () => dispatch(toggleHighlight()),
        handleSavePieces: (pieces) => dispatch(savePieces(pieces)),
        updatePiece: (id, piece) => dispatch(updatePiece(id, piece)),
        savePiece: (id) => dispatch(savePiece(id)),
        setCurrentSourcePieceId: id => dispatch(setCurrentSourcePieceId(id)),

        pageStartCreating: page => dispatch(pageStartCreating(page)),
        savePage: index => dispatch(savePage(index))
    }
};

const RedaxtorBar = connect(
    mapStateToProps,
    mapDispatchToProps
)(RedaxtorBarComponent);

export default RedaxtorBar