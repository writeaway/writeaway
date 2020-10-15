import { connect } from 'react-redux';
import { IWriteAwayState, IWriteAwayStateExtension } from 'types';
import { HoverOverlay as HoverOverlayComponent } from '../components/HoverOverlay';

const mapStateToProps = (state: IWriteAwayStateExtension) => ({
  enabled: state['@writeaway'].pieces.editorActive,
  triggeredByActionId: !!state['@writeaway'].pieces.activeIds &&
    state['@writeaway'].pieces.activeIds.length > 0
    && state['@writeaway'].pieces.activeIds[0] === state['@writeaway'].pieces.hoveredId,
  hoveredId: state['@writeaway'].pieces.hoveredId,
  hoveredRect: state['@writeaway'].pieces.hoveredRect,
  hoveredPiece: state['@writeaway'].pieces.hoveredId ? state['@writeaway'].pieces.byId[state['@writeaway'].pieces.hoveredId] : undefined,
});

const mapDispatchToProps = () => ({});

const HoverOverlay = connect(
  mapStateToProps,
  mapDispatchToProps,
)(HoverOverlayComponent);

export default HoverOverlay;
