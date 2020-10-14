import { GalleryItem, IPiecesAPI } from '@writeaway/core';
import React, { useCallback, useState } from 'react';
import Popup from './Popup';
import Portal from './Portal';

export interface GalleryProps {
  gallery: Array<GalleryItem>,
  api: IPiecesAPI,
  onChange: (item: GalleryItem) => void,
  onDelete: (id: string) => void,
}

export const Gallery = (
  {
    gallery,
    api,
    onChange,
    onDelete,
  }: GalleryProps,
) => {
  const [image, setImage] = useState<GalleryItem>();

  const confirmDelete = useCallback(() => {
    if (image) {
      if (onDelete) {
        onDelete(image.id || image.src);
      }
      setImage(undefined);
    }
  }, [image, onDelete, setImage]);

  const cancelDelete = useCallback(() => {
    setImage(undefined);
  }, [setImage]);

  return (
    <div className="gallery-wrapper">
      <h5 style={{ textAlign: 'center' }}>Pick From Uploaded</h5>
      <div className="gallery-container">
        {Object.values(gallery).map((item: GalleryItem, index: number) => (
          <div key={item.id || index} className="gallery-item-container">
            <div
              role="button"
              tabIndex={-1}
              className="gallery-item"
              onClick={() => onChange(item)}
              style={{ backgroundImage: `url(${item.thumbnailSrc ? item.thumbnailSrc : item.src})` }}
            >
              <span className="hover-shadow" />
              {api.deleteImage
              && (
                <span
                  role="button"
                  tabIndex={-1}
                  className="delete-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImage(item);
                  }}
                >
                  <i className="fa fa-trash-o" aria-hidden="true" />
                </span>
              )}
            </div>
            <div
              className="item-title"
            >
              {(item.src && item.src.split('/').pop()) || 'N/A'}
              {' '}
              {(item.width && item.height) && (`${item.width}×${item.height}`)}
            </div>
          </div>
        ))}
        {Object.keys(gallery).length === 0
        && (
          <div style={{ textAlign: 'center' }}>
            <p>&nbsp;</p>
            <p>No Images Uploaded</p>
            <p>&nbsp;</p>
          </div>
        )}
      </div>
      {image
      && (
        <Portal portalId="confirm">
          <Popup contentClass="confirm">
            <div style={{ textAlign: 'center' }}>
              <p>Delete this image?</p>
              <img
                className="gallery-item"
                src={image.src}
                alt={image.alt}
                style={{ maxWidth: '200px', maxHeight: '200px' }}
              />
            </div>
            <div className="actions-bar" style={{ textAlign: 'center' }}>
              <div role="button" tabIndex={-1} className="button button-cancel" onClick={cancelDelete}>Cancel</div>
              <div role="button" tabIndex={-1} className="button button-save" onClick={confirmDelete}>Confirm</div>
            </div>
          </Popup>
        </Portal>
      )}
    </div>
  );
};

export default Gallery;
