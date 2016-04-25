import React, {Component} from "react";

class PieceLine extends Component {
    shouldComponentUpdate(nextProps) {
        return this.props.edit !== nextProps.edit || this.props.piece.changed !== nextProps.piece.changed;
    }

    render() {
        const {piece, edit, setSourceId, source} = this.props;
        const id = piece.id;
        return (
            <div className="item-row">
                <span className="piece-name">{piece.name || id}</span>
                <span className="item-right">
                    {source && edit && <span className="piece-icon" onClick={()=>setSourceId(id)}>code</span>}
                    {piece.changed && <span className="piece-icon" onClick={this.props.savePiece}>save</span>}
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
            <div className="items-list">
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
