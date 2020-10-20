import { hoverPiece } from 'actions/pieces';
import { connect } from 'react-redux';
import { Dispatch, IWriteAwayStateExtension, Rect } from 'types';
import { REDUCER_KEY } from '../constants';
import { HoverOverlay as HoverOverlayComponent } from '../components/HoverOverlay';

const mapStateToProps = (state: IWriteAwayStateExtension) => {
  const { pieces } = state[REDUCER_KEY];
  const { config } = state[REDUCER_KEY];
  return ({
    components: config.piecesOptions.components,
    enabled: pieces.editorActive,
    isNodeVisible: config.api.isNodeVisible,
    getNodeRect: config.api.getNodeRect,
    activeIds: pieces.activeIds,
    triggeredByActionId: !!pieces.activeIds
    && pieces.activeIds.length > 0
    && pieces.activeIds[0] === pieces.hoveredId,
    hoveredId: pieces.hoveredId,
    byId: pieces.byId,
    editorEnabled: pieces.editorEnabled,
    hoveredRect: pieces.hoveredRect,
    hoveredPiece: pieces.hoveredId ? pieces.byId[pieces.hoveredId] : undefined,
  });
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  hoverPiece: (foundId?: string, foundRect?: Rect) => dispatch(hoverPiece(foundId, foundRect)),
});

const HoverOverlay = connect(
  mapStateToProps,
  mapDispatchToProps,
)(HoverOverlayComponent);

export default HoverOverlay;
