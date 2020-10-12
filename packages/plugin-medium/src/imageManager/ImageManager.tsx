import { GalleryItem, RedaxtorAPI } from '@writeaway/core';
import { boundMethod } from 'autobind-decorator';
import { pickerColors } from 'contants';
import vanillaColorPicker, { PickerHolder } from 'helpers/VanillaColorPicker';
import React, { Component } from 'react';
import { RedaxtorImageData } from 'types';
import Popup from './components/Popup';
import Gallery from './components/Gallery';
import { RxCheckBox } from './components/RxCheckBox';

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
    dataset?: { [k: string]: string }
  },
  onClose?: () => unknown,
  onSave?: (data: RedaxtorImageData) => unknown,
}

function BackgroundInputs(
  {
    onChangeSize,
    onChangePosition,
    onChangeRepeat,
    bgSize,
    bgRepeat,
    bgPosition,
  }: {
    bgRepeat?: string;
    bgPosition?: string;
    bgSize?: string,
    onChangeSize: (e: React.ChangeEvent<HTMLSelectElement>) => void,
    onChangeRepeat: (e: React.ChangeEvent<HTMLSelectElement>) => void,
    onChangePosition: (e: React.ChangeEvent<HTMLSelectElement>) => void
  },
) {
  return (
    <div className="sizes item-form">
      <label>Customize Background Tiling &amp; Fitting</label>
      <div className="input-container">
        <select
          name="background-size"
          value={bgSize}
          onChange={onChangeSize}
        >
          <option value="">Don't Resize</option>
          <option value="cover">Resize to Fill</option>
          <option value="contain">Resize to Fit</option>
        </select>
      </div>
      <div className="input-container">
        <select
          name="background-repeat"
          value={bgRepeat}
          onChange={onChangeRepeat}
        >
          <option value="no-repeat">No Tiling</option>
          <option value="repeat">Tile</option>
          <option value="repeat-x">Tile Horizontally</option>
          <option value="repeat-y">Tile Vertically</option>
        </select>
      </div>
      <div className="input-container">
        <select
          name="background-position"
          value={bgPosition}
          onChange={onChangePosition}
        >
          <option value="50% 50%">Center</option>
          <option value="0px 0px">Top Left</option>
          <option value="50% 0px">Top Center</option>
          <option value="100% 0px">Top Right</option>
          <option value="0px 100%">Bottom Left</option>
          <option value="50% 100%">Bottom Center</option>
          <option value="100% 100%">Bottom Right</option>
        </select>
      </div>
    </div>
  );
}

function BackgroundColor(
  {
    colorInput, colorDivRef, onChange, onClick, bgColor,
  }:
  {
    colorInput: (input: HTMLInputElement) => void,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onClick: (e: React.MouseEvent<HTMLElement>) => void,
    bgColor?: string,
    colorDivRef: (div: HTMLDivElement) => void
  },
) {
  return (
    <div className="sizes item-form">
      <label>Specify Background Color</label>
      <div className="input-container">
        <input
          ref={colorInput}
          onChange={onChange}
          onClick={onClick}
          placeholder="CSS Color"
          value={bgColor || ''}
          style={{ width: '130px', marginRight: '5px' }}
        />
        <div
          role="button"
          tabIndex={-1}
          color={bgColor}
          ref={colorDivRef}
          onClick={onClick}
          className="color-pick"
          style={{ backgroundColor: bgColor || '' }}
        >
          <i className="rx_icon rx_icon-brush" />
        </div>
      </div>
      <div className="description">Click to pick a Color</div>
    </div>
  );
}

function ImageDimensions({
  onClick, onChange, onChangeHeight, checked, width, height,
}: {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  width?: number,
  height?: number,
  onChangeHeight: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onClick: (e: React.MouseEvent) => void,
  checked: boolean
}) {
  return (
    <div className="sizes item-form">
      <label>Customize Image Dimensions</label>
      <div className="input-container">
        <input
          onChange={onChange}
          placeholder="width"
          value={width || ''}
          style={{ width: '65px', marginRight: '5px' }}
        />
      </div>
      ×
      <div className="input-container">
        <input
          onChange={onChangeHeight}
          placeholder="height"
          value={height || ''}
          style={{ width: '65px', marginLeft: '10px' }}
        />
      </div>
      <div
        className="proportions-checkbox"
        onClick={onClick}
        role="button"
        tabIndex={-1}
      >
        <RxCheckBox checked={checked} />
        <label>Constrain proportions</label>
      </div>
    </div>
  );
}

export default class ImageManager extends Component<ImageManagerProps, ImageManagerState> {
  state: ImageManagerState = {
    isVisible: false,
    settings: {
      editBackground: false,
      editDimensions: false,
    },
    gallery: [],
    proportions: true,
    uploading: false,
  };

  private colorDiv?: HTMLDivElement | null;

  private colorInput?: HTMLInputElement | null;

  private picker?: PickerHolder;

  constructor(props: ImageManagerProps) {
    super(props);
    this.updateImageList();
  }

  updateImageList() {
    this.props.api
    && this.state.pieceRef
    && this.props.api.getImageList
    && this.props.api.getImageList(this.state.pieceRef).then(
      (list: Array<GalleryItem>) => {
        this.setState({ gallery: list });
      },
    );
  }

  toggleImagePopup() {
    this.setState({ isVisible: !this.state.isVisible });
  }

  @boundMethod
  onClose() {
    this.toggleImagePopup();
    if (this.state.onClose) {
      this.state.onClose();
    }
    this.resetData();
  }

  @boundMethod
  onSave() {
    this.toggleImagePopup();
    if (this.state.onSave) {
      this.state.onSave(this.getImageData());
    }
    this.resetData();
  }

  @boundMethod
  onUrlChange(imageData: RedaxtorImageData) {
    this.updateData(
      {
        src: imageData.src,
        alt: imageData.alt,
        title: imageData.title,
      }, () => {
        this.getImageSize(imageData);
      },
    );
  }

  updateData(data: Partial<RedaxtorImageData>, callback?: ()=>void) {
    this.setState((state) => ({
      ...state,
      data: {
        ...state.data,
        ...data,
      },
    }
    ), callback);
  }

  getImageSize(imageData: RedaxtorImageData, getOriginalSizeOnly: boolean = false) {
    // if is image from gallery
    if (imageData.width && imageData.height) {
      !getOriginalSizeOnly && this.updateData({ width: imageData.width, height: imageData.height });
      this.updateData({ originalWidth: imageData.width, originalHeight: imageData.height });
    } else {
      const img = new Image();
      img.onload = () => {
        !getOriginalSizeOnly && this.updateData({ width: img.width, height: img.height });
        this.updateData({ originalWidth: img.width, originalHeight: img.height });
      };
      img.src = imageData.src || '';
    }
  }

  @boundMethod
  setBgSize(e: React.ChangeEvent<HTMLSelectElement>) {
    const bgSize = e.target.value;
    this.updateData({ bgSize });
  }

  @boundMethod
  setBgPosition(e: React.ChangeEvent<HTMLSelectElement>) {
    const bgPosition = e.target.value;
    this.updateData({ bgPosition });
  }

  @boundMethod
  setBgColor(e: React.ChangeEvent<HTMLInputElement>) {
    const bgColor = e.target.value;
    this.updateData({ bgColor });
  }

  @boundMethod
  pickBgColor(e: React.MouseEvent<HTMLElement>) {
    this.attachPickerAndInvoke();
  }

  @boundMethod
  setBgRepeat(e: React.ChangeEvent<HTMLSelectElement>) {
    const bgRepeat = e.target.value;
    this.updateData({ bgRepeat });
  }

  attachPickerAndInvoke() {
    /**
     * If we have previously created color picker that is not bound to correct element, kill it
     */
    if (this.picker) {
      if (this.picker.elem !== this.colorDiv) {
        this.picker.destroyPicker();
        this.picker = undefined;
      }
    }

    /**
     * If we still have a picker, open it
     */
    if (this.picker) {
      this.picker.openPicker();
    } else {
      // Create new picker
      this.picker = vanillaColorPicker(this.colorDiv!);
      this.picker.emit('customColors', pickerColors);
      this.picker.emit('positionOnTop');
      this.picker.openPicker();
      this.picker.on('colorChosen', (color: string) => {
        if (color === 'inherit') {
          this.updateData({
            bgColor: '',
          });
        } else {
          this.updateData({
            bgColor: color,
          });
        }
      });
    }
  }

  @boundMethod
  onWidthChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value && !isNaN(Number(e.target.value))) {
      const newWidth: number = +e.target.value;
      this.updateData({ width: newWidth });
      if (this.state.proportions && this.state.data?.originalHeight && this.state.data?.originalWidth) {
        this.updateData({ height: Math.floor((newWidth * this.state.data.originalHeight) / this.state.data.originalWidth) });
      }
    }
  }

  @boundMethod
  onHeightChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value && !isNaN(Number(e.target.value))) {
      const newHeight = +e.target.value;
      this.updateData({ height: newHeight });
      if (this.state.proportions && this.state.data?.originalHeight && this.state.data?.originalWidth) {
        this.updateData({ width: Math.floor((newHeight * this.state.data.originalWidth) / this.state.data.originalHeight) });
      }
    }
  }

  closePopup() {
    this.setState({ isVisible: false });
  }

  showPopup() {
    this.setState({ isVisible: true });
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
    this.setState({ ...this.state, ...data });
    if (data.data?.src) {
      this.getImageSize(data.data, !!data.data.width);
    }
    this.updateImageList();
  }

  sendFile(file: File | FileList) {
    if (this.props.api.uploadImage) {
      this.setState({ uploading: true });
      this.props.api.uploadImage(file).then((response: GalleryItem | GalleryItem[]) => {
        const files = Array.isArray(response) ? response : [response];
        const newImageData: GalleryItem[] = files.map((r) => ({
          src: r.src,
          thumbnailSrc: r.thumbnailSrc,
          width: r.width,
          height: r.height,
          id: r.id,
        } as GalleryItem));
        this.onUrlChange(newImageData[0]);
        this.setState({ uploading: false, uploadError: undefined, gallery: [...this.state.gallery, ...newImageData] });
      }).catch((e: Error) => {
        this.setState({ uploading: false, uploadError: 'Failed to Upload, Sorry' });
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
    this.updateData(data, () => {
      if (data?.src) {
        this.getImageSize(data, !!data.width);
      }
    });
  }

  @boundMethod
  deleteGalleryItem(id: string) {
    if (this.props.api.deleteImage) {
      this.props.api.deleteImage(id).then(() => {
        const index = this.state.gallery.findIndex((element) => (element.id || element.src) === id);
        this.state.gallery.splice(index, 1);
        this.forceUpdate();
      });
    }
  }

  resetData() {
    this.setState({
      data: {},
      settings: {
        editBackground: false,
        editDimensions: false,
      },
    });
  }

  render() {
    const { data } = this.state;
    return (
      <div>
        {this.state.isVisible && (
          <Popup>
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
                  <input
                    onChange={(e) => this.onUrlChange({ src: e.target.value })}
                    placeholder="http://domain.com/image.png"
                    value={data?.src || ''}
                  />
                </div>
                {!this.state.settings.editBackground
                && (
                  <div className="item-form">
                    <label
                      title="The term ALT tag is a common shorthand term used to refer to the ALT attribute within in the IMG tag. Any time you use an image, be sure to include an ALT tag or ALT text within the IMG tag. Doing so will provide a clear text alternative of the image for screen reader users. If you have an image that’s used as a button to buy product X, the alt text would say: “button to buy product X”"
                    >
                      Add
                      Image Alt Tag
                      {' '}
                      <i className="rx_icon rx_icon-info_outline" />
                    </label>
                    <input
                      onChange={(e) => this.updateData({ alt: e.target.value })}
                      placeholder="Example: Dalmatian puppy playing fetch"
                      value={data?.alt || ''}
                    />
                  </div>
                )}
                <div className="item-form">
                  <label>Enter Title Tag</label>
                  <input
                    onChange={(e) => this.updateData({ title: e.target.value })}
                    placeholder="Image title"
                    value={data?.title || ''}
                  />
                </div>
                {this.state.settings.editDimensions
                && (
                  <ImageDimensions
                    onChange={this.onWidthChange}
                    height={data?.height}
                    width={data?.width}
                    onChangeHeight={this.onHeightChange}
                    onClick={(e) => {
                      this.setState({ proportions: !this.state.proportions });
                    }}
                    checked={this.state.proportions}
                  />
                )}
                {this.state.settings.editBackground
                && (
                  <BackgroundInputs
                    bgPosition={data?.bgPosition}
                    bgRepeat={data?.bgRepeat}
                    bgSize={data?.bgSize}
                    onChangeSize={this.setBgSize}
                    onChangeRepeat={this.setBgRepeat}
                    onChangePosition={this.setBgPosition}
                  />
                )}
                <div />
                {this.state.settings.editBackground
                && (
                  <BackgroundColor
                    colorInput={(input) => {
                      this.colorInput = input;
                    }}
                    onChange={this.setBgColor}
                    onClick={this.pickBgColor}
                    bgColor={data?.bgColor}
                    colorDivRef={(div) => {
                      this.colorDiv = div;
                    }}
                  />
                )}
              </div>
              <div className="image-right-part">
                <div
                  className={`preview-wrapper ${this.props.api.uploadImage ? 'upload' : 'no-upload'}${this.state.uploading ? ' uploading' : ''}`}
                  style={{ backgroundImage: `url(${data?.src})` }}
                >
                  {this.props.api.uploadImage
                  && (
                    <input
                      type="file"
                      className="upload"
                      title="Choose a file to upload"
                      onChange={(e) => {
                        e.target.files && this.sendFile(e.target.files);
                      }}
                    />
                  )}
                </div>
                {!this.state.uploadError && this.props.api.uploadImage
                && <p style={{ textAlign: 'center' }}>Click Image to Upload</p>}
                {this.state.uploadError
                && <p style={{ color: 'red', textAlign: 'center' }}>{this.state.uploadError}</p>}
              </div>
            </div>

            <div className="r_modal-actions-bar r_modal-actions-bar-im">
              <div className="button button-save" onClick={this.onSave}>Save</div>
            </div>

            {
              this.state.gallery
              && (
                <Gallery
                  gallery={this.state.gallery}
                  api={this.props.api}
                  onChange={this.selectGalleryItem}
                  onDelete={this.deleteGalleryItem}
                />
              )
            }

          </Popup>
        )}
      </div>
    );
  }
}
