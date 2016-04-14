import React, {Component} from "react"
import {toastr} from 'react-redux-toastr'
import classNames from 'classnames';

class PieceLine extends Component {
    shouldComponentUpdate(nextProps) {
        return this.props.edit !== nextProps.edit || this.props.piece.changed !== nextProps.piece.changed;
    }

    render() {
        const {piece, edit, setSourceId, source} = this.props;
        const id = piece.id;
        return (
            <div className="piece-row">
                <span className="piece-name">{piece.name || id}</span>
                {
                    source &&
                    <div className={classNames({"icon-button":true, "disabled": !edit})} title="Source" onClick={()=>setSourceId(id)}>
                        <i className="material-icons">code</i>
                    </div>
                }
                <div className="icon-button" onClick={()=>piece.node.scrollIntoView()} title="Scroll to element">
                    <i className="material-icons">find_in_page</i>
                </div>
                {
                    piece.changed &&
                    <div className="icon-button need-save" title="Save piece" onClick={this.props.savePiece}>
                        <i className="material-icons">save</i>
                    </div>
                }

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
            <div className="pieces-list">
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
