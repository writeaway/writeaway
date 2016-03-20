import React, {Component} from "react"

class Piece extends Component {
    
    render() {
        let props = {...this.props};
        var className = "redaxtor-piece";
        if (this.props.highlight) className += " redaxtor-highlight";
        if (this.props.edit && !this.props.click) className += " redaxtor-edit";
        if (this.props.saving) className += " redaxtor-piece-saving";
        props.className = className;

        props.style = {
            width: "100%",
            height: "100%"
        };
        
        // console.log("render piece", props);
        return <div {...props}>{this.props.children}</div>
    }
}
export default Piece