import { connect } from 'react-redux';
import { IWriteAwayStateExtension } from 'types';
import { REDUCER_KEY } from '../constants';
import { HoverOverlay as HoverOverlayComponent } from '../components/HoverOverlay';

const mapStateToProps = (state: IWriteAwayStateExtension) => {
  const { pieces } = state[REDUCER_KEY];
  const { config } = state[REDUCER_KEY];
  return ({
    components: config.piecesOptions.components,
    enabled: pieces.editorActive,
    triggeredByActionId: !!pieces.activeIds
    && pieces.activeIds.length > 0
    && pieces.activeIds[0] === pieces.hoveredId,
    hoveredId: pieces.hoveredId,
    hoveredRect: pieces.hoveredRect,
    hoveredPiece: pieces.hoveredId ? pieces.byId[pieces.hoveredId] : undefined,
  });
};

const mapDispatchToProps = () => ({});

const HoverOverlay = connect(
  mapStateToProps,
  mapDispatchToProps,
)(HoverOverlayComponent);

export default HoverOverlay;
