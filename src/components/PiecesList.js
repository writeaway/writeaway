import React, {Component} from "react"
import FontIcon from 'material-ui/src/font-icon'
import Colors from 'material-ui/src/styles/colors'
import IconButton from 'material-ui/src/icon-button';


class PiecesList extends Component {
    scrollToPiece (piece){
        piece.node.scrollIntoView();
    }
    render() {
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
                        <div style={flexContainer}>
                            <div style={flexChild}>{this.props.pieces[key].node.dataset.name || key}</div>
                            <div>
                                <FontIcon className="material-icons">{(isPieceHidden)?'visibility_off':'visibility'}</FontIcon>
                            </div>
                            <div>
                                <IconButton
                                    iconClassName="material-icons"
                                    tooltip="Edit Source" disabled={!this.props.edit} >
                                    code
                                </IconButton>
                            </div>
                            {scrollButton}
                        </div>
                    )
                })}
            </div>
        );
    }
}
export default PiecesList
