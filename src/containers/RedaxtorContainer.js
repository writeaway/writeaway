import {connect} from 'react-redux'
import {toggleEdit, toggleHighlight, savePieces} from '../actions'
import RedaxtorBarComponent from '../components/RedaxtorBar'

// class RedaxtorContainer extends Component {
//     componentWillReceiveProps(nextProps) {
// if (nextProps.edit !== this.props.edit) {
//     if (nextProps.edit) {
//         const mapStateToProps = state => {
//             return {
//                 name: name.toLowerCase(),
//                 data: getData(state, name.toLowerCase()),
//                 highlight: state.highlight,
//                 text: el.innerHTML//todo - temp checking
//             }
//         }
//         const mapDispatchToProps = dispatch => {
//             return {
//                 updateData: (name, data) => dispatch(updateData(name, data)),
//                 saveComponent: () => dispatch(saveComponent())//todo save
//             }
//         }
//
//         let Component = connect(mapStateToProps, mapDispatchToProps)(components[name])
//
//         ReactDOM.render(<Provider store={store}><Component/></Provider>, el);
//     } else {
//         React.unmountComponentAtNode(node);
//     }
// }

// this.setState({
//     likesIncreasing: nextProps.likeCount > this.props.likeCount
// });
// }

// render() {
//     return (
//         <RedaxtorBarComponent {...this.props} />
//     )
// }
// }

// CartContainer.propTypes = {
//     products: PropTypes.arrayOf(PropTypes.shape({
//         id: PropTypes.number.isRequired,
//         title: PropTypes.string.isRequired,
//         price: PropTypes.number.isRequired,
//         quantity: PropTypes.number.isRequired
//     })).isRequired,
//     total: PropTypes.string,
//     checkout: PropTypes.func.isRequired
// }

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
        handleSavePieces: (pieces) => dispatch(savePieces(pieces))
    }
}

const RedaxtorBar = connect(
    mapStateToProps,
    mapDispatchToProps
// )(RedaxtorContainer)
)(RedaxtorBarComponent)

export default RedaxtorBar