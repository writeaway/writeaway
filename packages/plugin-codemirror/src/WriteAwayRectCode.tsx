import { connectDynamicActions, IReactActionProps, IReactPieceProps } from '@writeaway/core';
import React, { useCallback, useEffect, useState } from 'react';
import { WriteAwayCodeMirrorData } from 'types';
import WriteAwayCodemirror from './WriteAwayCodemirror';

export const WriteAwayReactCodeUnconnected = ({
  id, name, html, updateNode, attachComponent, addPiece, removePiece,
}: WriteAwayCodeMirrorData & IReactActionProps<WriteAwayCodeMirrorData> & IReactPieceProps) => {
  const [node, setNode] = useState<HTMLDivElement | undefined>(undefined);
  useEffect(() => {
    attachComponent('source', WriteAwayCodemirror);
    return () => {
      removePiece(id);
    };
  }, [id]);

  useEffect(() => {
    if (node) {
      addPiece({
        id,
        type: 'source',
        name,
        node,
        data: {
          html, updateNode,
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
  return <div ref={setElement} dangerouslySetInnerHTML={{ __html: html }} />;
};

export const WriteAwayReactCode = connectDynamicActions(WriteAwayReactCodeUnconnected);
