import { connect } from 'react-redux';
import { IWriteAwayState } from 'types';
import { HoverOverlay as HoverOverlayComponent } from '../components/HoverOverlay';

const mapStateToProps = (state: IWriteAwayState) => ({
  enabled: state.pieces.editorActive,
  triggeredByActionId: !!state.pieces.activeIds && state.pieces.activeIds.length > 0 && state.pieces.activeIds[0] === state.pieces.hoveredId,
  hoveredId: state.pieces.hoveredId,
  hoveredRect: state.pieces.hoveredRect,
  hoveredPiece: state.pieces.hoveredId ? state.pieces.byId[state.pieces.hoveredId] : undefined,
});

const mapDispatchToProps = () => ({});

const HoverOverlay = connect(
  mapStateToProps,
  mapDispatchToProps,
)(HoverOverlayComponent);

export default HoverOverlay;
