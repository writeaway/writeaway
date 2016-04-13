import React, {Component} from "react"

class PanelHandler extends Component {

    render() {
        return (
            <div className={"bar-header"} onMouseDown={this.props.onMouseDown}>
                redaxtor
                <button className={"icon-button bar-header-button"}
                            onClick={this.props.toggleOpen}>
                    {this.props.isOpen ? <i className={"material-icons"}>arrow_drop_up</i> : <i className={"material-icons"}>arrow_drop_down</i>}
                </button>
            </div>
        )
    }
}
export default PanelHandler