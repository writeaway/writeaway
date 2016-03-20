import {connect} from 'react-redux'
import {updatePiece, savePiece} from '../actions'

const connectPieceComponent = (Component, id) => {
    const mapStateToProps = state => {
        return {
            data: state.pieces[id].data,
            highlight: state.highlight,
            edit: state.edit
        }
    }
    const mapDispatchToProps = dispatch => {
        return {
            updatePiece: (id, piece) => dispatch(updatePiece(id, piece)),
            savePiece: (id) => dispatch(savePiece(id))
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(Component)
}

export default connectPieceComponent;