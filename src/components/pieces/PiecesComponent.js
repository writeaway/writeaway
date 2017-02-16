import React from 'react'
import PiecesList from './PiecesList'

import Toggle from 'react-toggle'

export default class PiecesComponent extends React.Component {

    savePiece(html) {
        let id = this.props.sourceId;
        this.props.updatePiece(id, {data: {html: html}});
        this.props.savePiece(id);
        this.props.setSourceId(null);
    }


    componentDidMount() {
        this.props.piecesInit();
    }

    toggleAllEditors(e) {
        this.props.piecesToggleEdit(false);
    }

    render() {
        let representPieceTypes = {};
        this.props.byId && Object.keys(this.props.byId).forEach(pieceId => representPieceTypes[this.props.byId[pieceId].type] = true);


        var sourceEditor = null;
        if (this.props.components.source && this.props.sourceId) {
            sourceEditor = <this.props.components.source wrapper="redaxtor-modal"
                                                         html={this.props.byId[this.props.sourceId].data.html}
                                                         onClose={() => this.props.setSourceId(null)}
                                                         onSave={(html) => this.savePiece(html)}/>
        }
        return (
            <div>
                {sourceEditor}
                <div className="r_list-header">
                    <label>All Editors</label>
                    <Toggle checked={this.props.editorActive}
                            onChange={this.toggleAllEditors.bind(this)}/>
                </div>
                {   Object.keys(this.props.components).map((object, index) =>
                    representPieceTypes[object] && (<div className="r_list-header r_list-subheader" key={index}>
                        <label>{this.props.components[object].__name || object}</label>
                        <Toggle checked={this.props[`editorEnabled:${object}`]}
                                disabled={!this.props.editorActive}
                                onChange={() => this.props.piecesToggleEdit(object)}/>
                    </div>)
                ) }
                <PiecesList editorActive={this.props.editorActive } pieces={this.props.byId || {}}
                            source={this.props['editorEnabled:source'] && this.props.components.source}
                            setSourceId={this.props.setSourceId}
                            activatePiece={this.props.activatePiece}
                            pieceNameGroupSeparator={this.props.options.pieceNameGroupSeparator}
                            savePiece={this.props.savePiece} updatePiece={this.props.updatePiece}/>
            </div>
        )
    }
}