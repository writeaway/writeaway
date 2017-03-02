import {connect} from 'react-redux';
import HoverOverlayComponent from '../components/HoverOverlay';

const mapStateToProps = (state) => {
    return {

        enabled: state.pieces.editorActive,
        hoveredId: state.pieces.hoveredId,
        hoveredRect: state.pieces.hoveredRect,
        hoveredPiece: state.pieces.hoveredId ? state.pieces.byId[state.pieces.hoveredId] : null
    }
};

const mapDispatchToProps = (dispatch) => {
    return {}
};

const HoverOverlay = connect(
    mapStateToProps,
    mapDispatchToProps
)(HoverOverlayComponent);

export default HoverOverlay;