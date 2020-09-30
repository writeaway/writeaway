import {connect} from 'react-redux';
import HoverOverlayComponent from '../components/HoverOverlay.js';

const mapStateToProps = (state) => {
    return {

        enabled: state.pieces.editorActive,
        triggeredByActionId: state.pieces.activeId && state.pieces.activeId.length > 0 && state.pieces.activeId[0] == state.pieces.hoveredId,
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
