import {connect} from 'react-redux'
import {toggleEdit, toggleHighlight, savePieces, updatePiece, savePiece} from '../actions'
import RedaxtorBarComponent from '../components/RedaxtorBar'

const mapStateToProps = (state) => {
    return {
        edit: state.edit,
        highlight: state.highlight,
        pieces: state.pieces
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        handleToggleEdit: () => dispatch(toggleEdit()),
        handleToggleHighlight: () => dispatch(toggleHighlight()),
        handleSavePieces: (pieces) => dispatch(savePieces(pieces)),
        updatePiece: (id, piece) => dispatch(updatePiece(id, piece)),
        savePiece: (id) => dispatch(savePiece(id))
    }
}

const RedaxtorBar = connect(
    mapStateToProps,
    mapDispatchToProps
)(RedaxtorBarComponent)

export default RedaxtorBar