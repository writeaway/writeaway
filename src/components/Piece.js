import React, {Component} from "react"

class Piece extends Component {
    
    render() {
        let props = {...this.props};
        if (!props.style) props.style = {};
        props.style = {...props.style, width: "100%", height: "100%"};
        if (this.props.edit) props.style.outline = "2px dotted #3c93eb";
        
        return <div {...props}>{this.props.children}</div>
    }
}
export default Piece