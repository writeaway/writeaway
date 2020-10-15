import { attachComponent } from 'actions';
import {
  addPiece, removePiece,
} from 'actions/pieces';
import { connect } from 'react-redux';
import { Dispatch, IComponent, IPieceItem, PieceType } from 'types';

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  /**
   * Dynamically add component to support piece type
   */
  attachComponent: (type: PieceType, component: IComponent) => dispatch(attachComponent(type, component)),
  /**
   * Dynamically add piece
   */
  addPiece: (piece: IPieceItem) => dispatch(addPiece(piece)),
  /**
   * Dynamically remove piece
   */
  removePiece: (pieceId: string) => dispatch(removePiece(pieceId)),
});

export default connect(mapStateToProps, mapDispatchToProps);
