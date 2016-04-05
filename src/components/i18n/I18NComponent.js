import React from 'react'
import I18NList from './I18NList'

import Toggle from 'material-ui/lib/toggle'
import RaisedButton from 'material-ui/lib/raised-button'

export default class PiecesComponent extends React.Component {
    render() {
        return (
            <div>
                <Toggle label="Edit & Highlight on the page" defaultToggled={this.props.edit}
                        onToggle={this.props.i18nToggleEdit}/>
                <I18NList {...this.props}/>
                <RaisedButton label="Save all" secondary={true} onClick={this.props.i18nSave}/>
            </div>
        )
    }
}