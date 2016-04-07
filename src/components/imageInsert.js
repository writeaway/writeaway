import React, {Component} from "react"
import {connect} from 'react-redux'

import * as actions from '../actions/insertImage'

import Dialog from 'material-ui/lib/dialog'
import FlatButton from 'material-ui/lib/flat-button'
import TextField from 'material-ui/lib/text-field';

export default class ImageInsert extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    onClose () {
        this.props.toggleImagePopup();
        this.props.image.onCancel && this.props.image.onCancel();
    }

    onSave () {
        this.props.toggleImagePopup();
        this.props.image.onSave && this.props.image.onSave();
    }

    render() {

        const actions = [
                <FlatButton label="Cancel" secondary={true}
                            onClick={this.onClose.bind(this)} />,
                <FlatButton label="Save" primary={true} keyboardFocused={true}
                            onClick={this.onSave.bind(this)}/>
            ],
            previewStyle = {
                position: "absolute",
                right: "10px",
                top: "10px",
                maxWidth: "300px"
            }
        return (
            <div>
                <Dialog title="" actions={actions} modal={true} open={this.props.image.isVisible}>
                    <TextField onChange={e=>this.props.saveImageData({url: e.target.value})}
                               floatingLabelText="Enter image URL" value={this.props.image.url||""}
                    /><br />
                    <TextField onChange={e=>this.props.saveImageData({alt: e.target.value})}
                               floatingLabelText="Enter image alt" value={this.props.image.alt||""}
                    /><br />

                </Dialog>
            </div>
        )

    }
}

const mapStateToProps = (state) => {
    return {
        image: state.imageInsert
    }
};

const ImgInsContainer = connect(
    mapStateToProps,
    {...actions}
)(ImageInsert);

export default ImgInsContainer;


