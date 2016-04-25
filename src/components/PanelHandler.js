import React, {Component} from "react";

class PanelHandler extends Component {

    render() {
        return (
            <div className="r_bar-header" onMouseDown={this.props.onMouseDown}>
                <span>R_</span>
                <button className="r_bar-header-button" onClick={this.props.toggleOpen}>
                    {this.props.isOpen ? <i className="r_icon-down-dir"></i> : <i className="r_icon-up-dir"></i>}
                </button>
            </div>
        )
    }
}
export default PanelHandler