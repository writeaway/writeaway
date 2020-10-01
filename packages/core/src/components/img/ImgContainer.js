import React, {Component} from 'react'
import {connect} from 'react-redux'

/**
 * TODO: Is deprecated?
 */
class ImgComponent extends Component {
    render() {
        return <this.props.wrapper>
            <img src={this.props.src} alt={this.props.alt}/>
        </this.props.wrapper>
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
