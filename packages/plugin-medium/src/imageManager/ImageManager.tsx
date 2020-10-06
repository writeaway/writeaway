import { GalleryItem, RedaxtorAPI } from '@writeaway/core';
import { boundMethod } from 'autobind-decorator';
import { pickerColors } from 'contants';
import React, { Component } from 'react'
import { RedaxtorImageData } from 'types';
import Popup from './components/Popup'
import Gallery from './components/Gallery'
import vanillaColorPicker from '../helpers/VanillaColorPicker';
import RxCheckBox from './components/RxCheckBox';


export interface ImageManagerProps {
  api: RedaxtorAPI;
}

export interface ImageManagerState {
  isVisible: boolean,
  settings: {
    editBackground: boolean,
    editDimensions: boolean,
  },
  data?: RedaxtorImageData,
  proportions: boolean,
  uploading: boolean,
  uploadError?: string,
  gallery: Array<GalleryItem>
  pieceRef?: {
    type: string,
    data: RedaxtorImageData,
    id: string,
    dataset: Record<string, string>
  },
  onClose?: () => unknown,
  onSave?: (data: RedaxtorImageData) => unknown,
}

export default class ImageManager extends Component<ImageManagerProps> {
  state: ImageManagerState = {
    isVisible: false,
    settings: {
      editBackground: false,
      editDimensions: false,
    },
    gallery: [],
    proportions: true,
    uploading: false
  }

  private colorDiv?: HTMLDivElement | null;
  private colorInput?: HTMLInputElement | null;
  private picker: any;

  constructor(props: ImageManagerProps) {
    super(props);
    this.updateImageList();
  }

  updateImageList() {
    this.props.api
    && this.props.api.getImageList
    && this.props.api.getImageList(this.state.pieceRef).then(
      (list: Array<GalleryItem>) => {
      this.setState({ gallery: list })
    });
  }


  toggleImagePopup() {
    this.setState({ isVisible: !this.state.isVisible })
  }

  @boundMethod
  onClose() {
    this.toggleImagePopup();
    this.state.onClose && this.state.onClose();
    this.resetData();
  }

  @boundMethod
  onSave() {
    this.toggleImagePopup();
    this.state.onSave && this.state.onSave(this.getImageData());
    this.resetData();
  }

  @boundMethod
  onUrlChange(imageData: RedaxtorImageData) {
    this.setState({ data: { ...this.state.data, src: imageData.src, alt: '' } });
    this.getImageSize(imageData);
  }

  getImageSize(imageData: RedaxtorImageData, getOriginalSizeOnly: boolean = false) {

    //if is image from gallery
    if (imageData.width && imageData.height) {
      !getOriginalSizeOnly && this.setState({ width: imageData.width, height: imageData.height });
      this.setState({ originalWidth: imageData.width, originalHeight: imageData.height });
    } else {
      const img = new Image();
      img.onload = () => {
        !getOriginalSizeOnly && this.setState({ width: img.width, height: img.height });
        this.setState({ originalWidth: img.width, originalHeight: img.height });
      };
      img.src = imageData.src || '';
    }

  }

  @boundMethod
  setBgSize(e: React.ChangeEvent<HTMLSelectElement>) {
    const bgSize = e.target.value;
    this.setState({ bgSize });
  }

  @boundMethod
  setBgPosition(e: React.ChangeEvent<HTMLSelectElement>) {
    const bgPosition = e.target.value;
    this.setState({ bgPosition });
  }

  @boundMethod
  setBgColor(e: React.ChangeEvent<HTMLInputElement>) {
    const bgColor = e.target.value;
    this.setState({ bgColor });
  }

  @boundMethod
  pickBgColor(e: React.MouseEvent<HTMLElement>) {
    this.attachPickerAndInvoke();
  }

  setBgRepeat(e: React.ChangeEvent<HTMLSelectElement>) {
    const bgRepeat = e.target.value;
    this.setState({ bgRepeat });
  }

  attachPickerAndInvoke() {
    /**
     * If we have previously created color picker that is not bound to correct element, kill it
     */
    if (this.picker) {
      if (this.picker.__boundElement != this.colorDiv) {
        this.picker.destroyPicker();
        this.picker = null;
      }
    }

    /**
     * If we still have a picker, open it
     */
    if (this.picker) {
      this.picker.openPicker();
    } else {
      //Create new picker
      this.picker = vanillaColorPicker(this.colorDiv);
      this.picker.set('customColors', pickerColors);
      this.picker.set('positionOnTop');
      this.picker.openPicker();
      this.picker.on('colorChosen', (color: string) => {
        if (color === 'inherit') {
          this.setState({
            bgColor: ''
          })
        } else {
          this.setState({
            bgColor: color
          })
        }
      });
      this.picker.__boundElement = this.colorDiv;
    }
  }

  @boundMethod
  onWidthChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value && !isNaN(Number(e.target.value))) {
      const newWidth: number = +e.target.value;
      this.setState({ width: newWidth });
      if (this.state.proportions && this.state.data?.originalHeight && this.state.data?.originalWidth) {
        this.setState({ height: Math.floor(newWidth * this.state.data.originalHeight / this.state.data.originalWidth) });
      }
    }
  }

  @boundMethod
  onHeightChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value && !isNaN(Number(e.target.value))) {
      const newHeight = +e.target.value;
      this.setState({ height: newHeight });
      if (this.state.proportions && this.state.data?.originalHeight && this.state.data?.originalWidth) {
        this.setState({ width: Math.floor(newHeight * this.state.data.originalWidth / this.state.data.originalHeight) });
      }
    }
  }

  closePopup() {
    this.setState({ isVisible: false })
  }

  showPopup() {
    this.setState({ isVisible: true })
  }

  getImageData() {
    const data: RedaxtorImageData = {
      alt: this.state.data?.alt || '',
      title: this.state.data?.title || '',
      src: this.state.data?.src || '',
    };

    /**
     * If image was resized, export new sizes
     */
    if (this.state.data?.originalHeight !== this.state.data?.height || this.state.data?.originalWidth !== this.state.data?.width) {
      data.width = this.state.data?.width;
      data.height = this.state.data?.height;
    }

    /**
     * If editing background, pass backgrounds too
     */
    if (this.state.settings.editBackground) {
      data.bgColor = this.state.data?.bgColor;
      data.bgPosition = this.state.data?.bgPosition;
      data.bgRepeat = this.state.data?.bgRepeat;
      data.bgSize = this.state.data?.bgSize;
    }

    return data;
  }

  setImageData(data: Partial<ImageManagerState>) {
    this.setState(data);
    if (data.data?.src) {
      this.getImageSize(data.data, !!data.data.width)
    }
    this.updateImageList();
  }

  sendFile(files) {
    if (this.props.api.uploadImage) {
      //if (!this.state.file || !this.state.file[0]) return;
      var formdata = new FormData();

      //save code. If it will necessary use multiple files uploadin then just uncomment this code
      /*  for(let i = 0; i < files.file.length; i++ ) {
          formdata.append("images[]", files.file[i], files.file[i].name);
        }*/
      formdata.append('image', files.file[0]);
      this.setState({ uploading: true });
      this.props.api.uploadImage(formdata).then((response: GalleryItem) => {
        let newImageData: GalleryItem = {
          src: response.src,
          thumbnailSrc: response.thumbnailSrc,
          width: response.width,
          height: response.height,
          id: response.id
        };
        this.onUrlChange(newImageData);
        this.setState({ file: null, uploading: false, uploadError: undefined, gallery: [...this.state.gallery, newImageData] });
      }).catch((e: Error) => {
        this.setState({ file: null, uploading: false, uploadError: 'Failed to Upload, Sorry' });
        console.error(e);
      });
    }
  }

  /**
   * save new images data
   * @param data {object} new image data
   */
  @boundMethod
  selectGalleryItem(data: RedaxtorImageData) {
    //change URL
    if (data.src !== this.state.data?.src) {
      this.onUrlChange(data)
    }
    // data.pieceRef = this.state.pieceRef;
    this.setImageData({ data })

  }

  @boundMethod
  deleteGalleryItem(id: string) {
    if (this.props.api.deleteImage) {
      this.props.api.deleteImage(id).then(() => {
        const index = this.state.gallery.findIndex(element => (element.id || element.url) === id);
        this.state.gallery.splice(index, 1);
        this.forceUpdate()
      })
    }
  }

  resetData() {
    this.setState({
      url: null,
      alt: null,
      title: null,
      api: {},
      width: null,
      height: null,
      originalHeight: null,
      originalWidth: null,
      onClose: null,
      onSave: null,
      settings: {}
    })
  }

  render() {
    const { data } = this.state;
    return (
      <div>
        {this.state.isVisible && <Popup isOpen={this.state.isVisible}>
            <div className="r_modal-title">
                <div className="r_modal-close" onClick={this.onClose}>
                    <i className="rx_icon rx_icon-close">&nbsp;</i>
                </div>
                <span>Insert Image</span>
            </div>
            <div className="image-inputs-container">
                <div className="image-left-part">
                    <div className="item-form">
                        <label>Enter Image URL</label>
                        <input onChange={e => this.onUrlChange({ src: e.target.value })}
                               placeholder="http://domain.com/image.png" value={data?.src || ''}/>
                    </div>
                  {!this.state.settings.editBackground &&
                  <div className="item-form">
                      <label
                          title="The term ALT tag is a common shorthand term used to refer to the ALT attribute within in the IMG tag. Any time you use an image, be sure to include an ALT tag or ALT text within the IMG tag. Doing so will provide a clear text alternative of the image for screen reader users. If you have an image that’s used as a button to buy product X, the alt text would say: “button to buy product X”">Add
                          Image Alt Tag <i className="rx_icon rx_icon-info_outline"></i></label>
                      <input onChange={e => this.setState({ alt: e.target.value })}
                             placeholder="Example: Dalmatian puppy playing fetch"
                             value={data?.alt || ''}/>
                  </div>
                  }
                    <div className="item-form">
                        <label>Enter Title Tag</label>
                        <input onChange={e => this.setState({ title: e.target.value })}
                               placeholder="Image title" value={data?.title || ''}/>
                    </div>
                  {this.state.settings.editDimensions &&
                  <div className="sizes item-form">
                      <label>Customize Image Dimensions</label>
                      <div className="input-container">
                          <input onChange={this.onWidthChange}
                                 placeholder="width" value={data?.width || ''}
                                 style={{ width: '65px', marginRight: '5px' }}/>
                      </div>
                      ×
                      <div className="input-container">
                          <input onChange={this.onHeightChange}
                                 placeholder="height" value={data?.height || ''}
                                 style={{ width: '65px', marginLeft: '10px' }}/>
                      </div>
                      <div className="proportions-checkbox" onClick={e => {
                        this.setState({ proportions: !this.state.proportions })
                      }}>
                          <RxCheckBox checked={this.state.proportions}/>
                          <label>Constrain proportions</label>
                      </div>

                  </div>
                  }
                  {this.state.settings.editBackground &&
                  <div className="sizes item-form">
                      <label>Customize Background Tiling &amp; Fitting</label>
                      <div className="input-container">
                          <select name="background-size" value={data?.bgSize}
                                  onChange={this.setBgSize}>
                              <option value="">Don't Resize</option>
                              <option value="cover">Resize to Fill</option>
                              <option value="contain">Resize to Fit</option>
                          </select>
                      </div>
                      <div className="input-container">
                          <select name="background-repeat" value={data?.bgRepeat}
                                  onChange={this.setBgRepeat}>
                              <option value="no-repeat">No Tiling</option>
                              <option value="repeat">Tile</option>
                              <option value="repeat-x">Tile Horizontally</option>
                              <option value="repeat-y">Tile Vertically</option>
                          </select>
                      </div>
                      <div className="input-container">
                          <select name="background-position" value={data?.bgPosition}
                                  onChange={this.setBgPosition}>
                              <option value="50% 50%">Center</option>
                              <option value="0px 0px">Top Left</option>
                          </select>
                      </div>
                  </div>}
                    <div></div>
                  {this.state.settings.editBackground &&
                  <div className="sizes item-form">
                      <label>Specify Background Color</label>
                      <div className="input-container">
                          <input ref={(input) => {
                            this.colorInput = input;
                          }} onChange={this.setBgColor}
                                 onClick={this.pickBgColor}
                                 placeholder="CSS Color" value={data?.bgColor || ''}
                                 style={{ width: '130px', marginRight: '5px' }}/>
                          <div color={data?.bgColor} ref={(div) => {
                            this.colorDiv = div;
                          }} onClick={this.pickBgColor} className="color-pick"
                               style={{ backgroundColor: data?.bgColor || '' }}><i
                              className="rx_icon rx_icon-brush"></i>
                          </div>
                      </div>
                      <div className="description">Click to pick a Color</div>
                  </div>
                  }
                </div>
                <div className="image-right-part">
                    <div
                        className={'preview-wrapper ' + (this.props.api.uploadImage ? 'upload' : 'no-upload') + (this.state.uploading ? ' uploading' : '')}
                        style={{ backgroundImage: `url(${data?.src})` }}>
                      {this.props.api.uploadImage &&
                      <input type="file" className="upload" title="Choose a file to upload"
                             onChange={(e) => {
                               this.setState({ file: e.target.files });
                               this.sendFile({ file: e.target.files });
                             }}/>}
                    </div>
                  {!this.state.uploadError && this.props.api.uploadImage &&
                  <p style={{ textAlign: 'center' }}>Click Image to Upload</p>}
                  {this.state.uploadError &&
                  <p style={{ color: 'red', textAlign: 'center' }}>{this.state.uploadError}</p>}
                </div>
            </div>

            <div className="r_modal-actions-bar r_modal-actions-bar-im">
                <div className="button button-save" onClick={this.onSave}>Save</div>
            </div>

          {
            this.state.gallery &&
            <Gallery gallery={this.state.gallery} api={this.props.api}
                     onChange={this.selectGalleryItem}
                     onDelete={this.deleteGalleryItem}
            />
          }

        </Popup>
        }
      </div>
    )
  }
}
