import React from 'react'
import I18NList from './I18NList'

import Toggle from 'react-toggle'

export default class PiecesComponent extends React.Component {
    render() {
        return (
            <div>
                <div className="r_list-header">
                    <label>Edit & Highlight on the page</label>
                    <Toggle defaultChecked={this.props.edit}
                            onChange={this.props.i18nToggleEdit}/>
                </div>
                <I18NList {...this.props}/>
                <div className="button button-save" onClick={this.props.i18nSave}>Save all</div>
            </div>
        )
    }
}