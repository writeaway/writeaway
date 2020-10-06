import React, {Component} from "react"
import classNames from "classnames"

export default class Popup extends Component {
    constructor(props) {
        super(props)
        this.state = {show: false}
    }

    componentDidMount() {
        setTimeout(()=>this.setState({show: true}),0)
    }

    componentWillUnmount() {
        this.setState({show: false})
    }
    render() {
        var contentClasses = "r_modal-content " + (this.props.contentClass?this.props.contentClass:"");
        return (
            <div className={classNames({"r_modal-overlay": true, "r_reset": true, "r_visible": this.state.show})}>
                <div className={contentClasses}>
                    {this.props.children}
                </div>
            </div>

        )
    }
}