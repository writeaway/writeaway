import React, {Component} from "react";
import i18n from '../i18n.js';

class PanelHandler extends Component {

    render() {
        return (
            <div className="r_bar-header" onMouseDown={this.props.onMouseDown} onClick={this.props.toggleOpen}>
                <span>{i18n.bar.title}</span>
                {this.props.isCollapsable &&
                    <button className="r_bar-header-button">
                        {this.props.isOpen ? <i className="rx_icon rx_icon-keyboard_arrow_down"></i> : <i className="rx_icon rx_icon-keyboard_arrow_up"></i>}
                    </button>}
                {this.props.message ? <div className="r_message r_message-{this.prop.message.type}">{this.prop.message.content}</div>:""}
            </div>
        )
    }
}
export default PanelHandler
