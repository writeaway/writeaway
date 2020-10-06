import React, {Component} from "react"
import ReactDOM from 'react-dom'

var Portal = React.createClass({
    render: () => null,
    portalElement: null,
    componentDidMount() {
        var p = this.props.portalId && document.getElementById(this.props.portalId);
        if (!p) {
            var p = document.createElement('div');
            p.id = this.props.portalId;
            document.body.appendChild(p);
        }
        this.portalElement = p;
        this.componentDidUpdate();
    },
    componentWillUnmount() {
        document.body.removeChild(this.portalElement);
    },
    componentDidUpdate() {
        ReactDOM.render(<div {...this.props}>{this.props.children}</div>, this.portalElement);
    }
});

export default Portal;