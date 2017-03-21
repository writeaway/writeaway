import React from 'react';
import PiecesList from './PiecesList';

import RxCheckBox from '../RxCheckBox';

import i18n from '../../i18n';

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
                <div className="r_list-header-container">
                    <div className="r_list-header" onClick={this.toggleAllEditors.bind(this)}>
                        <label>{i18n.bar.editAll}</label>
                        <RxCheckBox checked={this.props.editorActive}/>
                    </div>
                    {   Object.keys(this.props.components).map((object, index) =>
                        representPieceTypes[object] && (<div className="r_list-header r_list-subheader" key={index} onClick={() => this.props.piecesToggleEdit(object)}>
                            <label>{this.props.components[object].__name || object}</label>
                            <RxCheckBox checked={this.props[`editorEnabled:${object}`]}
                                    disabled={!this.props.editorActive}
                                    />
                        </div>)
                    ) }
                </div>
                <PiecesList editorActive={this.props.editorActive } pieces={this.props.byId || {}}
                            source={this.props['editorEnabled:source'] && this.props.components.source}
                            allProps={this.props} // TODO: This is ugly
                            setSourceId={this.props.setSourceId}
                            activatePiece={this.props.activatePiece}
                            pieceNameGroupSeparator={this.props.options.pieceNameGroupSeparator}
                            savePiece={this.props.savePiece} updatePiece={this.props.updatePiece}/>
            </div>
        )
    }
}