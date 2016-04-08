import React from 'react'
import PiecesList from './PiecesList'

import Toggle from 'material-ui/lib/toggle'
import RaisedButton from 'material-ui/lib/raised-button'

export default class PiecesComponent extends React.Component {

    savePiece(html) {
        let id = this.props.currentSourcePieceId;
        this.props.updatePiece(id, {data: {html: html}});
        this.props.savePiece(id);
        this.props.setCurrentSourcePieceId(null);
    }

    render() {
        var sourceEditor = null;
        if (this.props.components.source && this.props.currentSourcePieceId) {
            sourceEditor = <this.props.components.source
                html={this.props.pieces[this.props.currentSourcePieceId].data.html}
                onClose={()=>this.props.setCurrentSourcePieceId(null)}
                onSave={(html)=>this.savePiece(html)}/>
        }
        return (
            <div>
                {sourceEditor}
                <Toggle label="Edit" defaultToggled={this.props.edit}
                        onToggle={this.props.toggleEdit}/>

                <PiecesList edit={this.props.edit} pieces={this.props.pieces}
                            components={this.props.components}
                            savePiece={this.props.savePiece} updatePiece={this.props.updatePiece}
                            setCurrentSourcePieceId={this.props.setCurrentSourcePieceId}/>
                <RaisedButton label="Save all" secondary={true}
                              onClick={()=>this.props.savePieces(this.props.pieces)}/>
            </div>
        )
    }
}