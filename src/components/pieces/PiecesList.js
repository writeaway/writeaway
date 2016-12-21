import React, {Component} from "react";

class PieceLine extends Component {
    /*shouldComponentUpdate(nextProps) {
        return this.props.editorActive !== nextProps.editorActive || this.props.piece.changed !== nextProps.piece.changed;
    }*/

    render() {
        const {piece, editorActive, source} = this.props;
        const id = piece.id;
        return (
            <div className="r_item-row">
                <span>{piece.name || id}</span>
                <span className="r_item-right">
                    {source && editorActive && piece.data && piece.data.html && <i className="r_icon-code r_btn" onClick={()=>this.props.setSourceId(id)}></i>}
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
                               savePiece={()=>this.props.savePiece(id)}
                               source={this.props.source}
                               setSourceId={this.props.setSourceId}
                               editorActive={this.props.editorActive}/>
                )}
            </div>
        );
    }
}
export default PiecesList
