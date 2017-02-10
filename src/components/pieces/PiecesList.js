import React, {Component} from "react";

class PieceLine extends Component {
    /*shouldComponentUpdate(nextProps) {
     return this.props.editorActive !== nextProps.editorActive || this.props.piece.changed !== nextProps.piece.changed;
     }*/

    render() {
        const {piece, editorActive, source} = this.props;
        const id = piece.id;

        let name = piece.name ? piece.name.split(this.props.pieceNameGroupSeparator) : [id];
        let prevName = this.props.prevPieceName ? this.props.prevPieceName.split(this.props.pieceNameGroupSeparator) : [];

        return (
            <div className="r_item-row">
                <div>
                    <span className="r_item_name">
                        {name.map((namePart, index) => {
                            let omit = (name.length > 1 && prevName.length > 1 && namePart == prevName[index]) ? 'omit' : '';
                            return <span className={`level-${name.length > 1 ? index : 1} ${omit}`} key={index}>{namePart} </span>;
                        })
                        }
                    </span>
                    <span className="r_item-right">
                        {source && editorActive && piece.data && piece.data.html &&
                        <i className="r_icon-code r_btn" onClick={() => this.props.setSourceId(id)}></i>}
                        {piece.changed && <i className="r_icon-floppy r_btn" onClick={this.props.savePiece}></i>}
                    </span>
                </div>
                {piece.message &&
                <div className={`r_item-message r_item-${piece.messageLevel}`}>
                    <b>{piece.message}</b>
                </div>}
            </div>
        )
    }
}

class PiecesList extends Component {
    constructor() {
        super();
    }

    render() {
        let prevId;
        return (
            <div className="r_list">
                {Object.keys(this.props.pieces).map(id => {
                        let prevPieceName = prevId ? this.props.pieces[prevId].name : '';
                        prevId = id;

                        return <PieceLine key={id} piece={this.props.pieces[id]}
                                          savePiece={() => this.props.savePiece(id)}
                                          source={this.props.source}
                                          setSourceId={this.props.setSourceId}
                                          pieceNameGroupSeparator={this.props.pieceNameGroupSeparator}
                                          prevPieceName={prevPieceName}
                                          editorActive={this.props.editorActive}/>
                    }
                )}
            </div>
        );
    }
}
export default PiecesList
