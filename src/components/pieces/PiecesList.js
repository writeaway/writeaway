import React, {Component} from "react"
import IconButton from 'material-ui/lib/icon-button'
import ActionFindInPage from 'material-ui/lib/svg-icons/action/find-in-page'
import ActionCode from 'material-ui/lib/svg-icons/action/code'
import ContentSave from 'material-ui/lib/svg-icons/content/save'

class PieceLine extends Component {
    shouldComponentUpdate(nextProps) {
        return this.props.edit !== nextProps.edit || this.props.piece.changed !== nextProps.piece.changed;
    }

    render() {

        const height = 20;
        const {piece, edit, setSourceId, source} = this.props;
        const id = piece.id;
        const buttonStyle = {float: 'right', width: 20, height: height, padding: 1};//note float right changes order
        const iconStyle = {width: height - 2, height: height - 2};
        return (
            <div style={{padding: '2px 0'}}>
                <span style={{display: 'inline-block', height: height}}>{piece.name || id}</span>
                {
                    source &&
                    <IconButton style={buttonStyle} iconStyle={iconStyle} disabled={!edit}
                                tooltipPosition="top-left" tooltip="Source"
                                onClick={()=>setSourceId(id)}>
                        <ActionCode/>
                    </IconButton>
                }
                <IconButton style={buttonStyle} iconStyle={iconStyle} onClick={()=>piece.node.scrollIntoView()}
                            tooltipPosition="top-left" tooltip="Scroll to element">
                    <ActionFindInPage/>
                </IconButton>
                {
                    piece.changed &&
                    <IconButton style={buttonStyle} iconStyle={iconStyle}
                                tooltipPosition="top-left" tooltip="Save piece"
                                onClick={this.props.savePiece}>
                        <ContentSave color={"#2e7d32"} hoverColor={"#558b2f"}/>
                    </IconButton>
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
        const piecesListStyle = {maxHeight: '400px', overflow: 'auto'};
        return (
            <div style={piecesListStyle}>
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
