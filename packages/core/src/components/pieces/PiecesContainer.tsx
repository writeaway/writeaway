import { connect } from 'react-redux';
import { IWriteAwayStateExtension } from 'types';
import { REDUCER_KEY } from '../../constants';
import { PiecesComponent } from './PiecesComponent';
import * as piecesActions from '../../actions/pieces';

const mapStateToProps = (state: IWriteAwayStateExtension) => ({
  sourceId: state[REDUCER_KEY].pieces.sourceId,
  byId: state[REDUCER_KEY].pieces.byId,
  api: state[REDUCER_KEY].config.api,
  editorRoot: state[REDUCER_KEY].config.editorRoot,
  editorEnabled: state[REDUCER_KEY].pieces.editorEnabled,
  editorActive: state[REDUCER_KEY].pieces.editorActive,
  components: state[REDUCER_KEY].config.piecesOptions.components,
  pieceNameGroupSeparator: state[REDUCER_KEY].config.piecesOptions.nameGroupSeparator,
});

const PiecesContainer = connect(
  mapStateToProps,
  piecesActions,
)(PiecesComponent);

export default PiecesContainer;
