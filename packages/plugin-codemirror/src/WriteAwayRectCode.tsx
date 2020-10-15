import { IReactProps } from '@writeaway/core';
import React, { useCallback, useEffect, useState } from 'react';
import { RedaxtorCodeMirrorData } from 'types';
import RedaxtorCodemirror from './RedaxtorCodemirror';

export const WriteAwayReactCode = ({
  id, name, html, updateNode, attachComponent, addPiece, removePiece,
}: RedaxtorCodeMirrorData & IReactProps) => {
  const [node, setNode] = useState<HTMLDivElement | undefined>(undefined);
  useEffect(() => {
    attachComponent('seo', RedaxtorCodemirror);
    return () => {
      removePiece(id);
    };
  }, []);

  const setElement = useCallback((el: HTMLDivElement) => {
    setNode(el);
    if (el) {
      addPiece({
        id,
        type: 'seo',
        name,
        node: el,
        data: {
          html, updateNode,
        },
      });
    }
  }, [node]);

  // eslint-disable-next-line react/no-danger
  return <div ref={setElement} dangerouslySetInnerHTML={{ __html: html }} />;
};
