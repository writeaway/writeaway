import { connect } from 'react-redux';
import { IWriteAwayState, IWriteAwayStateExtension } from 'types';
import { PiecesComponent } from './PiecesComponent';
import * as piecesActions from '../../actions/pieces';

const mapStateToProps = (state: IWriteAwayStateExtension) => ({
  sourceId: state['@writeaway'].pieces.sourceId,
  byId: state['@writeaway'].pieces.byId,
  api: state['@writeaway'].config.api,
  editorRoot: state['@writeaway'].config.editorRoot,
  editorEnabled: state['@writeaway'].pieces.editorEnabled,
  editorActive: state['@writeaway'].pieces.editorActive,
  components: state['@writeaway'].config.piecesOptions.components,
  pieceNameGroupSeparator: state['@writeaway'].config.piecesOptions.nameGroupSeparator,
});

const PiecesContainer = connect(
  mapStateToProps,
  piecesActions,
)(PiecesComponent);

export default PiecesContainer;
