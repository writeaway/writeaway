import React, {Component} from "react";

class PanelHandler extends Component {

    render() {
        return (
            <div className="r_bar-header" onMouseDown={this.props.onMouseDown} onClick={this.props.toggleOpen}>
                <span>Redaxtor</span>
                <button className="r_bar-header-button">
                    {this.props.isOpen ? <i className="r_icon-down-dir"></i> : <i className="r_icon-up-dir"></i>}
                </button>
                {this.props.message ? <div className="r_message r_message-{this.prop.message.type}">{this.prop.message.content}</div>:""}
            </div>
        )
    }
}
export default PanelHandler