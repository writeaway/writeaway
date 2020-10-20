import { connectDynamicActions, IReactActionProps, IReactPieceProps } from '@writeaway/core';
import React, { useCallback, useEffect, useState } from 'react';
import { WriteAwayRichTextData } from 'types';
import WriteAwayMedium from './WriteAwayMedium';

export const RichTextUnconnected = ({
  id, name, html, attachComponent, addPiece, removePiece,
}: WriteAwayRichTextData & IReactActionProps<WriteAwayRichTextData> & IReactPieceProps) => {
  const [node, setNode] = useState<HTMLDivElement | undefined>(undefined);
  useEffect(() => {
    attachComponent('html', WriteAwayMedium);
    return () => {
      removePiece(id);
    };
  }, [id]);

  useEffect(() => {
    if (node) {
      addPiece({
        id,
        type: 'html',
        name,
        node,
        data: {
          html,
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

export const RichTextReact = connectDynamicActions(RichTextUnconnected);
