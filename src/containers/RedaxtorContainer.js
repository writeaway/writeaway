import {connect} from 'react-redux';
import {toggleEdit, toggleHighlight, savePieces, updatePiece, savePiece, setCurrentSourcePieceId} from '../actions';
import {pageDelete, savePage, pageUpdate, pageStartCreating, 
    pageSetCurrentIndex, pageCancelCreating,
    pageDataUpdate, pageDataFieldsUpdate, pageDataFieldsSet} from '../actions/pages';
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

        pageSetCurrentIndex: index => dispatch(pageSetCurrentIndex(index)),
        pageStartCreating: page => dispatch(pageStartCreating(page)),
        savePage: index => dispatch(savePage(index)),
        pageDataUpdate: (index, data) => dispatch(pageDataUpdate(index, data)),
        pageDataFieldsSet: (index, fields) => dispatch(pageDataFieldsSet(index, fields)),
        pageDataFieldsUpdate: (index, fields) => dispatch(pageDataFieldsUpdate(index, fields)),
        pageUpdate: (index, data) => dispatch(pageUpdate(index, data)),
        pageCancelCreating: () => dispatch(pageCancelCreating()),
        pageDelete: index => dispatch(pageDelete(index))
    }
};

const RedaxtorBar = connect(
    mapStateToProps,
    mapDispatchToProps
)(RedaxtorBarComponent);

export default RedaxtorBar