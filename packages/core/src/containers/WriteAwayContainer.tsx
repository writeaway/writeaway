import { connect } from 'react-redux';
import { Dispatch, IWriteAwayStateExtension } from 'types';
import { REDUCER_KEY } from '../constants';
import { showMessage, piecesToggleNavBar } from '../actions';
import { WriteAwayBar as WriteAwayBarComponent } from '../components/WriteAwayBar';

const mapStateToProps = (state: IWriteAwayStateExtension) => {
  const { global } = state[REDUCER_KEY];
  const { pieces } = state[REDUCER_KEY];
  return ({
    message: global.message,
    enabled: pieces.editorActive,
    navBarCollapsed: global.navBarCollapsed,
    expert: global.expert,
    hoveredId: pieces.hoveredId,
    hoveredRect: pieces.hoveredRect,
    hoveredPiece: pieces.hoveredId ? pieces.byId[pieces.hoveredId] : null,
  });
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  hideMessage: () => dispatch(showMessage()),
  piecesToggleNavBar: () => dispatch(piecesToggleNavBar()),
});

const WriteAwayBar = connect(
  mapStateToProps,
  mapDispatchToProps,
)(WriteAwayBarComponent);

export default WriteAwayBar;
