import React, {Component} from "react"
import {connect} from 'react-redux'
import * as actions from '../actions/images'
import Modal from 'react-modal'


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
        return (
            <div>
                <Modal isOpen={this.props.image.isVisible} overlayClassName="modal-overlay" className="modal-content"
                       onRequestClose={this.onClose.bind(this)}>
                    <div className="image-inputs-container">
                        <div className="image-left-part">
                            <div className="input-container">
                                <input onChange={e=>this.onUrlChange.call(this, e.target.value)}
                                       placeholder="Enter image URL" value={this.props.image.url||""}/>
                            </div>
                            <div className="input-container">
                                <input onChange={e=>this.props.saveImageData({alt: e.target.value})}
                                       placeholder="Enter image alt" value={this.props.image.alt||""}/>
                            </div>
                            <div className="sizes">
                                <div className="input-container">
                                    <input onChange={this.onWidthChange.bind(this)}
                                           placeholder="width" value={this.props.image.width||""}
                                           style={{width: "50px", marginRight: "10px"}}/>
                                </div>
                                px x
                                <div className="input-container">
                                    <input onChange={this.onHeightChange.bind(this)}
                                           placeholder="height" value={this.props.image.height||""}
                                           style={{width: "50px", marginLeft: "10px"}}/>
                                </div>
                                px
                                <label class="checkbox-label"><input type="checkbox"
                                                                     onChange={e=>{this.setState({proportions: e.target.checked})}}
                                                                     defaultChecked={this.state.proportions}/><span>Constrain proportions</span></label>

                            </div>
                        </div>
                        <div className="image-right-part">
                            <img src={this.props.image.url} alt={this.props.image.alt}/>
                        </div>
                    </div>
                    {
                        this.props.image.gallery &&
                        <div className="gallery-wrapper">
                            <h2>Uploaded images</h2>
                            <div className="gallery-container">
                                {Object.keys(this.props.image.gallery).map(index =>
                                    <div key={this.props.image.gallery[index]} className="gallery-item-container">
                                        <div className="gallery-item" style={{backgroundImage: "url("+this.props.image.gallery[index]+")"}}/>
                                    </div>
                                )}
                            </div>
                        </div>
                    }
                    <div className="actions-bar">
                        <div className="button button-cancel" onClick={this.onClose.bind(this)}>Cancel</div>
                        <div className="button button-save" onClick={this.onSave.bind(this)}>Save</div>
                    </div>
                </Modal>
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


