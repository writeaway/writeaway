import { connectDynamicActions, IReactActionProps, IReactPieceProps } from '@writeaway/core';
import React, { useCallback, useEffect, useState } from 'react';
import { WriteAwaySeoData } from 'types';
import { WriteAwaySeo } from './WriteAwaySeo';

export const WriteAwayReactSEOUnconnected = ({
  id, name, header, title, description, keywords, attachComponent, addPiece, removePiece, label,
}: WriteAwaySeoData & IReactActionProps<WriteAwaySeoData> & IReactPieceProps & { label?: string }) => {
  const [node, setNode] = useState<HTMLDivElement | undefined>(undefined);
  useEffect(() => {
    attachComponent('seo', WriteAwaySeo);
    return () => {
      removePiece(id);
    };
  }, [id]);

  useEffect(() => {
    if (node) {
      addPiece({
        id,
        type: 'seo',
        name,
        node,
        data: {
          header, title, description, keywords,
        },
        message: '',
        messageLevel: '',
      });
    }
  }, [id, node]);

  const setElement = useCallback((el: HTMLDivElement) => {
    setNode(el);
  }, [node]);

  // eslint-disable-next-line react/no-danger
  return <div ref={setElement}>{label || 'Click to Edit SEO Meta'}</div>;
};

export const WriteAwayReactSEO = connectDynamicActions(WriteAwayReactSEOUnconnected);
