import React, {Component} from "react"
import {indigo50, cyan500} from 'material-ui/lib/styles/colors'

import IconButton from 'material-ui/lib/icon-button'
import ActionSettings from 'material-ui/lib/svg-icons/action/settings'
import ArrowDropDown from 'material-ui/lib/svg-icons/navigation/arrow-drop-down'
import ArrowDropUp from 'material-ui/lib/svg-icons/navigation/arrow-drop-up'

class PanelHandler extends Component {

    render() {
        const handleStyle = {
            padding: '0 5px', height: "20px", cursor: "move", color: cyan500, backgroundColor: indigo50,
            borderRadius: "2px"
        }
        const handleButtonStyle = {float: 'right', width: 20, height: 20, padding: 1}
        return (
            <div style={handleStyle} onMouseDown={this.props.onMouseDown}>
                redaxtor
                <IconButton style={handleButtonStyle} iconStyle={{width: 18, height: 18}}>
                    <ActionSettings/>
                </IconButton>
                <IconButton style={handleButtonStyle} iconStyle={{width: 18, height: 18}}
                            onClick={this.props.toggleOpen}>
                    {this.props.isOpen ? <ArrowDropUp/> : <ArrowDropDown/>}
                </IconButton>
            </div>
        )
    }
}
export default PanelHandler