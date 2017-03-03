import React, {Component} from "react";

class PieceLine extends Component {
    /*shouldComponentUpdate(nextProps) {
     return this.props.editorActive !== nextProps.editorActive || this.props.piece.changed !== nextProps.piece.changed;
     }*/

    render() {
        const {piece, editorActive, source} = this.props;
        const id = piece.id;
        const hasActionOpen = true;
        //console.log(piece, this.props);

        let name = piece.name ? piece.name.split(this.props.pieceNameGroupSeparator) : [id];
        let prevName = this.props.prevPieceName ? this.props.prevPieceName.split(this.props.pieceNameGroupSeparator) : [];
        let noOmit = true;
        return (
            <div className={"r_item-row r_item-type-" + piece.type}>
                <div>
                    <span className="r_item_name">
                        {
                            name.map((namePart, index) => {
                                let omit = '';
                                if(noOmit && (name.length > 1 && prevName.length > 1 && namePart == prevName[index])) {
                                    omit = 'omit'
                                } else {
                                    noOmit = false; // Skip rest once met unmatch
                                }
                                return <span className={`level-${name.length > 1 ? index : 1} ${omit}`} key={index}>{namePart} </span>;
                            })
                        }
                    </span>
                    <span className="r_item-right">
                        {source && editorActive && piece.data && piece.data.html &&
                        <i className="rx_icon rx_icon-code r_btn" onClick={() => this.props.setSourceId(id)}></i>}

                        {piece.changed && <i className="r_icon-floppy r_btn" onClick={this.props.savePiece}></i>}

                        {editorActive && piece.data && !piece.data.html && hasActionOpen && <i className="rx_icon rx_icon-mode_edit r_btn" onClick={() => this.props.activatePiece(id)}></i>}
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
                        if(this.props.allProps['editorEnabled:'+this.props.pieces[id].type]) {
                            let prevPieceName = prevId ? this.props.pieces[prevId].name : '';
                            prevId = id;

                            return <PieceLine key={id} piece={this.props.pieces[id]}
                                           savePiece={() => this.props.savePiece(id)}
                                           activatePiece={this.props.activatePiece}
                                           source={this.props.source}
                                           setSourceId={this.props.setSourceId}
                                           pieceNameGroupSeparator={this.props.pieceNameGroupSeparator}
                                           prevPieceName={prevPieceName}
                                           editorActive={this.props.editorActive}/>
                        } else {
                            return false;
                        }
                    }
                )}
            </div>
        );
    }
}
export default PiecesList
