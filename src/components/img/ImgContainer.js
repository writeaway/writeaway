import React, {Component} from 'react'
import {connect} from 'react-redux'

class ImgComponent extends Component {
    render() {
        debugger;
        return (
            <div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    // return state.i18n
};

const ImgContainer = connect(
    mapStateToProps,
    {}
)(ImgComponent);

export default ImgContainer;
