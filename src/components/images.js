import React, {Component} from "react"
import {connect} from 'react-redux'

import * as actions from '../actions/images'

import Dialog from 'material-ui/lib/dialog'
import FlatButton from 'material-ui/lib/flat-button'
import TextField from 'material-ui/lib/text-field';
import Checkbox from 'material-ui/lib/checkbox';
import Paper from 'material-ui/lib/paper';

export default class Images extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    onClose() {
        this.props.toggleImagePopup();
        this.props.image.onCancel && this.props.image.onCancel();
    }

    onSave() {
        this.props.toggleImagePopup();
        this.props.image.onSave && this.props.image.onSave();
    }

    onUrlChange(url) {
        this.props.saveImageData({url: url});
        var that = this;
        var img = new Image();
        img.onload = function () {
            that.setState({width: this.width, height: this.height});
            that.props.saveImageData({width: this.width, height: this.height});
        }
        img.src = url;
    }

    onWidthChange(e) {
        let newWidth = e.target.value;
        this.props.saveImageData({width: newWidth});
        if (this.state.proportions) {
            this.props.saveImageData({height: parseInt(newWidth * this.state.height / this.state.width)});
        }
    }

    onHeightChange(e) {
        let newHeight = e.target.value;
        this.props.saveImageData({height: newHeight});
        if (this.state.proportions) {
            this.props.saveImageData({width: parseInt(newHeight * this.state.width / this.state.height)});
        }
    }

    render() {
        const actions = [
            <FlatButton label="Cancel" secondary={true}
                        onClick={this.onClose.bind(this)}/>,
            <FlatButton label="Save" primary={true} keyboardFocused={true}
                        onClick={this.onSave.bind(this)}/>
        ]
        return (
            <div>
                <Dialog title="" actions={actions} modal={true} open={this.props.image.isVisible}
                        autoScrollBodyContent={true}>
                    <div style={{display: "flex"}}>
                        <div style={{flex: "1 1 100%", marginRight: "20px"}}>
                            <TextField
                                onChange={e=>this.onUrlChange.call(this, e.target.value)}
                                floatingLabelText="Enter image URL" value={this.props.image.url||""}
                                style={{display: "block"}} fullWidth={true}/>
                            <TextField onChange={e=>this.props.saveImageData({alt: e.target.value})}
                                       floatingLabelText="Enter image alt" value={this.props.image.alt||""}
                                       style={{display: "block"}} fullWidth={true}/>
                            <TextField onChange={this.onWidthChange.bind(this)}
                                       floatingLabelText="width" value={this.props.image.width||""}
                                       style={{width: "50px", marginRight: "10px"}}/>
                            x
                            <TextField onChange={this.onHeightChange.bind(this)}
                                       floatingLabelText="height" value={this.props.image.height||""}
                                       style={{width: "50px", marginLeft: "10px"}}/>
                            <Checkbox onCheck={(e, status)=>this.setState({proportions: status})}
                                      label="Constrain proportions" defaultChecked={this.state.proportions}
                            />
                        </div>
                        <div style={{flex: "1 1 200px", height: "200px"}}>
                            <img src={this.props.image.url} alt={this.props.image.alt}
                                 style={{maxWidth: "100%", maxHeight: "100%"}}/>
                        </div>
                    </div>
                    {
                        this.props.image.gallery &&
                        <div>
                            <h2>Uploaded images</h2>
                            <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-between"}}>
                                {Object.keys(this.props.image.gallery).map(index =>
                                    <Paper key={this.props.image.gallery[index]}
                                           style={{width: "200px", height: "200px", cursor: "pointer", marginBottom: "10px"}}
                                           onClick={()=> {this.onUrlChange.call(this, this.props.image.gallery[index])}}>
                                        <div style={{height: "100%", width: "100%", backgroundImage: "url("+this.props.image.gallery[index]+")",
                                        backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center"}}>

                                        </div>
                                    </Paper>
                                )}
                            </div>
                        </div>
                    }
                </Dialog>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        image: state.images
    }
};

const ImgInsContainer = connect(
    mapStateToProps,
    {...actions}
)(Images);

export default ImgInsContainer;


