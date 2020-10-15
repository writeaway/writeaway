import { connect } from 'react-redux';
import { Dispatch, IWriteAwayStateExtension } from 'types';
import { showMessage, piecesToggleNavBar } from '../actions';
import { RedaxtorBar as RedaxtorBarComponent } from '../components/RedaxtorBar';

const mapStateToProps = (state: IWriteAwayStateExtension) => ({
  message: state['@writeaway'].global.message,
  enabled: state['@writeaway'].pieces.editorActive,
  navBarCollapsed: state['@writeaway'].global.navBarCollapsed,
  expert: state['@writeaway'].global.expert,
  hoveredId: state['@writeaway'].pieces.hoveredId,
  hoveredRect: state['@writeaway'].pieces.hoveredRect,
  hoveredPiece: state['@writeaway'].pieces.hoveredId ? state['@writeaway'].pieces.byId[state['@writeaway'].pieces.hoveredId] : null,
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
