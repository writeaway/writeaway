import { connectDynamicActions, IReactActionProps, IReactPieceProps } from '@writeaway/core';
import React, { useCallback, useEffect, useState } from 'react';
import { WriteAwayImageTagData } from 'types';
import ImageTagEditor from './ImageTagEditor';

export const ImageUnconnected = ({
  id, name, src, alt, title, attachComponent, addPiece, removePiece, className,
}: WriteAwayImageTagData & IReactActionProps<WriteAwayImageTagData> & IReactPieceProps & { className?: string }) => {
  const [node, setNode] = useState<HTMLImageElement | undefined>(undefined);
  useEffect(() => {
    attachComponent('image', ImageTagEditor);
    return () => {
      removePiece(id);
    };
  }, [id]);

  useEffect(() => {
    if (node) {
      addPiece({
        id,
        type: 'image',
        name,
        node,
        data: {
          alt, title, src,
        },
        message: '',
        messageLevel: '',
      });
    }
  }, [id, node]);

  const setElement = useCallback((el: HTMLImageElement) => {
    setNode(el);
  }, [node]);

  // eslint-disable-next-line react/no-danger
  return <img ref={setElement} src={src} alt={alt} className={className} title={title} />;
};

export const ImageReact = connectDynamicActions(ImageUnconnected);
