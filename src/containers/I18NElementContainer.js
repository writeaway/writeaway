import React, {Component} from "react"
import {connect} from 'react-redux'
import {updateI18NData} from '../actions/i18n'

import TextField from 'material-ui/lib/text-field';

import Portal from '../components/Portal'

class Element extends Component {
    constructor(props){
        super(props);
        this.state = {edit: false}
    }

    render() {
        let style = {};
        const {id, text, edit, updateI18NData} = this.props;

        if (edit) {
            style.outline = "2px dotted #3c93eb";
            style.cursor = "pointer";
        }

        let portal = null;
        if (this.state.edit && this.refs["el"]) {
            const rect = this.refs["el"].getBoundingClientRect();
            portal =
                <Portal top={rect.top + rect.height} left={rect.left} position="fixed"
                        onClose={()=>this.setState({edit: false})}>
                    <div>
                        <TextField value={text} floatingLabelText="text"
                                   onChange={e => updateI18NData(id, e.target.value)}/>
                    </div>
                </Portal>;
        }
        return (
            <span ref="el" style={style} onClick={()=>this.setState({edit: true})}>
                {text}
                {portal}
            </span>
        )

    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        text: state.i18n.data[ownProps.id],
        edit: state.i18n.edit
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateI18NData: (id, value) => dispatch(updateI18NData(id, value))
    }
};

const ConnectedElement = connect(
    mapStateToProps,
    mapDispatchToProps
)(Element);

export default ConnectedElement