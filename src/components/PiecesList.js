import React, {Component} from "react"
import FontIcon from 'material-ui/lib/font-icon'
import IconButton from 'material-ui/lib/icon-button';

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

    render() {
        var that = this;
        const flexContainer = {
            display: 'flex',
            alignItems: 'center'
        };
        const flexChild = {
            flexBasis: '50%'
        };
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
                        <div style={flexContainer} key={key}>
                            <div style={flexChild}>{this.props.pieces[key].node.dataset.name || key}</div>
                            <div>
                                <FontIcon className="material-icons">{(isPieceHidden)?'visibility_off':'visibility'}</FontIcon>
                            </div>
                            {this.props.components.source && <div>
                                <IconButton
                                    iconClassName="material-icons"
                                    tooltip="Edit Source" disabled={!this.props.edit}
                                    onClick={()=>that.props.setCurrentSourcePieceId(this.props.pieces[key].id)}
                                >
                                    code
                                </IconButton>
                            </div>}
                            {scrollButton}
                        </div>

                    )
                })}
            </div>
        );
    }
}
export default PiecesList
