import React, {Component} from "react";

/**
 * Piece name||id with 'source' and 'save' buttons
 */
class PieceLine extends Component {
    shouldComponentUpdate(nextProps) {
        return this.props.edit !== nextProps.edit || this.props.piece.changed !== nextProps.piece.changed;
    }

    render() {
        const {piece, edit, setSourceId, source} = this.props;
        const id = piece.id;
        return (
            <div className="r_item-row">
                <span>{piece.name || id}</span>
                <span className="r_item-right">
                    {source && edit && <i className="r_icon-code r_btn" onClick={()=>setSourceId(id)}></i>}
                    {piece.changed && <i className="r_icon-floppy r_btn" onClick={this.props.savePiece}></i>}
                </span>
            </div>
        )
    }
}

class PiecesList extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="r_list">
                {Object.keys(this.props.pieces).map(id =>
                    <PieceLine key={id} piece={this.props.pieces[id]}
                               setSourceId={this.props.setSourceId}
                               savePiece={()=>this.props.savePiece(id)}
                               source={this.props.source}
                               edit={this.props.edit}/>
                )}
            </div>
        );
    }
}
export default PiecesList
