import React from 'react'
import PiecesList from './PiecesList'

import Toggle from 'material-ui/lib/toggle'

export default class PiecesComponent extends React.Component {

    savePiece(html) {
        let id = this.props.sourceId;
        this.props.updatePiece(id, {data: {html: html}});
        this.props.savePiece(id);
        this.props.setSourceId(null);
    }

    render() {
        var sourceEditor = null;
        if (this.props.components.source && this.props.sourceId) {
            sourceEditor = <this.props.components.source
                html={this.props.byId[this.props.sourceId].data.html}
                onClose={()=>this.props.setSourceId(null)}
                onSave={(html)=>this.savePiece(html)}/>
        }
        return (
            <div>
                {sourceEditor}
                <Toggle label="Edit" defaultToggled={this.props.edit}
                        onToggle={this.props.piecesToggleEdit}/>

                <PiecesList edit={this.props.edit} pieces={this.props.byId}
                            source={this.props.components.source}
                            savePiece={this.props.savePiece} updatePiece={this.props.updatePiece}
                            setSourceId={this.props.setSourceId}/>
            </div>
        )
    }
}