import { connect } from 'react-redux';
import { IWriteAwayState } from 'types';
import { PiecesComponent } from './PiecesComponent';
import * as piecesActions from '../../actions/pieces';

const mapStateToProps = (state: IWriteAwayState) => ({
  sourceId: state.pieces.sourceId,
  byId: state.pieces.byId,
  api: state.config.api,
  editorEnabled: state.pieces.editorEnabled,
  editorActive: state.pieces.editorActive,
  components: state.config.piecesOptions.components,
  pieceNameGroupSeparator: state.config.pieceNameGroupSeparator,
});

const PiecesContainer = connect(
  mapStateToProps,
  piecesActions,
)(PiecesComponent);

export default PiecesContainer;
