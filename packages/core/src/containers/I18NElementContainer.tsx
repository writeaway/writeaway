import React, {Component} from "react"
import {connect} from 'react-redux'
import {updateI18NData} from '../actions/i18n'

import Portal from '../components/Portal'

/**
 * @deprecated
 */
class Element extends Component {
    constructor(props){
        super(props);
        this.state = {editorActive: false}
    }

    render() {
        let style = {};
        const {id, text, editorActive, updateI18NData} = this.props;

        if (editorActive) {
            style.outline = "2px dotted #3c93eb";
            style.cursor = "pointer";
        }

        let portal = null;
        if (this.state.editorActive && this.refs["el"]) {
            const rect = this.refs["el"].getBoundingClientRect();
            portal =
                <Portal top={rect.top + rect.height} left={rect.left} position="fixed"
                        onClose={()=>this.setState({editorActive: false})}>
                    <div className="input-container">
                        <input value={text} placeholder="text"
                                   onChange={e => updateI18NData(id, e.target.value)}/>
                    </div>
                </Portal>;
        }
        return (
            <span ref="el" style={style} onClick={()=>this.setState({editorActive: true})}>
                {text}
                {portal}
            </span>
        )

    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        text: state.i18n.data[ownProps.id],
        editorActive: state.i18n.editorActive
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
