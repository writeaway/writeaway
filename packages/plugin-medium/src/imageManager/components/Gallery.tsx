import React, {Component} from "react"
import Popup from './Popup'
import Portal from './Portal'

export default class Gallery extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    confirmDelete() {
        this.props.onDelete && this.props.onDelete(this.state.image.id || this.state.image.url);
        this.setState({image: null});
    }

    cancelDelete() {
        this.setState({image: null});
    }

    render() {
        return (
            <div className="gallery-wrapper">
                <h5 style={{textAlign: "center"}}>Pick From Uploaded</h5>
                <div className="gallery-container">
                    {Object.keys(this.props.gallery).map(index =>
                        <div key={this.props.gallery[index].id} className="gallery-item-container">
                            <div className="gallery-item"
                                 onClick={() => {
                                     this.props.onChange(this.props.gallery[index])
                                 }}
                                 style={{backgroundImage: "url(" + (this.props.gallery[index].thumbnailUrl ? this.props.gallery[index].thumbnailUrl : this.props.gallery[index]) + ")"}}>
                                <span className="hover-shadow"></span>
                                {this.props.api.deleteImage &&
                                <span className="delete-icon"
                                      onClick={(e) => {
                                          e.stopPropagation();
                                          this.setState({image: this.props.gallery[index]})
                                      }}>
                                    <i className="fa fa-trash-o" aria-hidden="true"></i>
                                </span>}
                            </div>
                            <div
                                className="item-title">{this.props.gallery[index].url.split('/').pop() || "N/A"} {(this.props.gallery[index].width && this.props.gallery[index].height) && (this.props.gallery[index].width + "×" + this.props.gallery[index].height)}
                            </div>
                        </div>
                    )}
                    {Object.keys(this.props.gallery).length==0 &&
                        <div style={{textAlign: "center"}}>
                            <p>&nbsp;</p>
                            <p>No Images Uploaded</p>
                            <p>&nbsp;</p>
                        </div>
                    }
                </div>
                {this.state.image &&
                <Portal portalId={"confirm"}>
                    <Popup contentClass={"confirm"}>
                        <div style={{textAlign: 'center'}}>
                            <p>Delete this image?</p>
                            <img className="gallery-item" src={this.state.image.url}
                                 style={{maxWidth: '200px', maxHeight: '200px'}}>
                            </img>
                        </div>
                        <div className="actions-bar" style={{textAlign: 'center'}}>
                            <div className="button button-cancel" onClick={this.cancelDelete.bind(this)}>Cancel</div>
                            <div className="button button-save" onClick={this.confirmDelete.bind(this)}>Confirm</div>
                        </div>
                    </Popup>
                </Portal>}
            </div>)
    }
}
