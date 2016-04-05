import React, {Component} from "react"
import IconButton from 'material-ui/lib/icon-button'
// import ActionVisibility from 'material-ui/lib/svg-icons/action/visibility'
// import ActionVisibilityOff from 'material-ui/lib/svg-icons/action/visibility-off'
import ActionFindInPage from 'material-ui/lib/svg-icons/action/find-in-page'
import ActionCode from 'material-ui/lib/svg-icons/action/code'

class PiecesList extends Component {
    constructor() {
        super();
    }

    render() {
        var that = this;
        const height = 20;
        const piecesListStyle = {maxHeight: '400px', overflow: 'auto'};
        const buttonStyle = {float: 'right', width: 20, height: height, padding: 1};//note float right changes order
        const iconStyle = {width: height - 2, height: height - 2};
        return (
            <div style={piecesListStyle}>
                {Object.keys(this.props.pieces).map(id => {
                    const piece = this.props.pieces[id];
                    return (
                        <div key={id} style={{padding: '2px 0'}}>
                            <span style={{display: 'inline-block', height: height}}>{piece.name || id}</span>
                            {
                                this.props.components.source &&
                                <IconButton style={buttonStyle} iconStyle={iconStyle} disabled={!this.props.edit}
                                            tooltipPosition="top-left" tooltip="Source"
                                            onClick={()=>that.props.setCurrentSourcePieceId(id)}>
                                    <ActionCode/>
                                </IconButton>
                            }
                            <IconButton style={buttonStyle} iconStyle={iconStyle}
                                        tooltipPosition="top-left" tooltip="Scroll to element"
                                        onClick={()=>piece.node.scrollIntoView()}><ActionFindInPage/></IconButton>
                        </div>
                    )
                })}
            </div>
        );
    }
}
export default PiecesList
