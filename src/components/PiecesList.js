import React, {Component} from "react"
import FontIcon from 'material-ui/src/font-icon'
import IconButton from 'material-ui/src/icon-button';

class PiecesList extends Component {
    constructor() {
        super();
        this.state = {
            showCodeMirror: false
        };
    }
    scrollToPiece (piece){
        piece.node.scrollIntoView();
    }

    savePiece(html) {
        let id = this.state.piece.id;
        this.props.updatePiece(id, {data: {html: html}});
        this.props.savePiece(id);
        this.setState({showCodeMirror: false,piece: null});
    }
    render() {
        var that = this;
        const flexContainer = {
            display: 'flex',
            alignItems: 'center'
        };
        const flexChild = {
            flexBasis: '50%'
        };
        var sourceEditor;
        if (this.props.components.source && this.state.showCodeMirror) {
            sourceEditor = <this.props.components.source
                html={this.state.piece.data.html} cb={{close:()=>this.setState({showCodeMirror: false,piece: null}),
                save: this.savePiece.bind(this)}}/>
        } else {
            sourceEditor = null;
        }
        return (
            <div>
                {Object.keys(this.props.pieces).map(key => {
                    var isPieceHidden = this.props.pieces[key].node.dataset.piece==='hiddenSource',
                        scrollButton = isPieceHidden ? null : <div>
                            <IconButton
                                iconClassName="material-icons"
                                tooltip="Scroll to Piece" disabled={!this.props.edit}
                                onClick={()=>this.scrollToPiece(this.props.pieces[key])}>
                                keyboard_arrow_down
                            </IconButton>
                        </div>
                    return (
                        <div style={flexContainer}>
                            <div style={flexChild}>{this.props.pieces[key].node.dataset.name || key}</div>
                            <div>
                                <FontIcon className="material-icons">{(isPieceHidden)?'visibility_off':'visibility'}</FontIcon>
                            </div>
                            {this.props.components.source && <div>
                                <IconButton
                                    iconClassName="material-icons"
                                    tooltip="Edit Source" disabled={!this.props.edit}
                                    onClick={()=>that.setState({showCodeMirror: true, piece: this.props.pieces[key]})}
                                >
                                    code
                                </IconButton>
                            </div>}
                            {scrollButton}
                        </div>

                    )
                })}
                {sourceEditor}
            </div>
        );
    }
}
export default PiecesList
