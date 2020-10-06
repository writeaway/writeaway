import { connect } from 'react-redux';
import { Dispatch, IWriteAwayState } from 'types';
import { showMessage, piecesToggleNavBar } from '../actions';
import { RedaxtorBar as RedaxtorBarComponent } from '../components/RedaxtorBar';

const mapStateToProps = (state: IWriteAwayState) => ({
  message: state.global.message,
  enabled: state.pieces.editorActive,
  navBarCollapsed: state.global.navBarCollapsed,
  expert: state.global.expert,
  hoveredId: state.pieces.hoveredId,
  hoveredRect: state.pieces.hoveredRect,
  hoveredPiece: state.pieces.hoveredId ? state.pieces.byId[state.pieces.hoveredId] : null,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  hideMessage: () => dispatch(showMessage()),
  piecesToggleNavBar: () => dispatch(piecesToggleNavBar()),
});

const RedaxtorBar = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RedaxtorBarComponent);

export default RedaxtorBar;
