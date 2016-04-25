import React, {Component} from "react"

class PanelHandler extends Component {

    render() {
        return (
            <div className={"bar-header"} onMouseDown={this.props.onMouseDown}>
                <span>redaxtor</span>
                <button className="bar-header-button" onClick={this.props.toggleOpen}>
                    {this.props.isOpen ? '▴' : '▾'}
                </button>
            </div>
        )
    }
}
export default PanelHandler