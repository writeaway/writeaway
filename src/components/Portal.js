import React from 'react'
import Portal from 'react-portal'

export default class FormPortal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isOpened: true};
    }

    render() {
        const style = {
            position: this.props.position || 'absolute',
            top: this.props.top,
            left: this.props.left,
            width: this.props.width || "auto",
            border: '1px solid gray',
            background: '#fff',
            zIndex: 100000,
            padding: 10
        };

        // var Children = React.Children.map(this.children.map, child => {
        //     return <div style={style}>{child}</div>
        // });

        // var Child = React.Children.toArray(this.props.children)[0];
        var Child = this.props.children;//https://facebook.github.io/react/tips/children-props-type.html
        return (
            <Portal closeOnOutsideClick isOpened={this.state.isOpened} style={style}
                    onClose={() => {this.onClose();}}>
                {Child}
            </Portal>
        );
    }

    onClose() {
        this.setState({isOpened: false});
        this.props.onClose && this.props.onClose();
    }
}


FormPortal.propTypes = {
    top: React.PropTypes.number,
    left: React.PropTypes.number,
    width: React.PropTypes.number,
    closePortal: React.PropTypes.func,
    onClose: React.PropTypes.func
};