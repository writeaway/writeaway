import React, {Component} from "react"
import {connect} from 'react-redux'
import {updateI18NData} from '../actions/i18n'

const ElementContainer = (props) => {
    let style = {};
    if (props.edit) style.outline = "2px dotted #3c93eb";
    return <span style={style}>{props.text}</span>
};

const mapStateToProps = (state, ownProps) => {
    return {
        text: state.i18n.data[ownProps.i18nId],
        edit: state.i18n.edit
    }
};

const ConnectedI18NElementContainer = connect(
    mapStateToProps,
    {updateI18NData}
)(ElementContainer);

export default ConnectedI18NElementContainer