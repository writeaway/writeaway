import { connect } from 'react-redux';
import { IWriteAwayState } from 'types';
import { PiecesComponent } from './PiecesComponent';
import * as piecesActions from '../../actions/pieces';

const mapStateToProps = (state: IWriteAwayState) => ({
  sourceId: state.pieces.sourceId,
  byId: state.pieces.byId,
  editorEnabled: state.pieces.editorEnabled,
  editorActive: state.pieces.editorActive,
  components: state.config.pieces.components,
  pieceNameGroupSeparator: state.config.pieceNameGroupSeparator,
});

const PiecesContainer = connect(
  mapStateToProps,
  piecesActions,
)(PiecesComponent);

export default PiecesContainer;
