import React from 'react'
import I18NList from './I18NList.js'

import Toggle from 'react-toggle'

/**
 * @deprecated
 */
export default class PiecesComponent extends React.Component {
    render() {
        return (
            <div>
                <div className="r_list-header">
                    <label>Edit & Highlight on the page</label>
                    <Toggle defaultChecked={this.props.editorActive}
                            onChange={this.props.i18nToggleEdit}/>
                </div>
                <I18NList {...this.props}/>
                <div className="button button-save" onClick={this.props.i18nSave}>Save all</div>
            </div>
        )
    }
}
