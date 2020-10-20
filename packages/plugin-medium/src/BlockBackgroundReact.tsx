import { connectDynamicActions, IReactActionProps, IReactPieceProps } from '@writeaway/core';
import React, { useCallback, useEffect, useState } from 'react';
import { WriteAwayBackgroundBlockData } from 'types';
import BackgroundImageEditor from './BackgroundImageEditor';

export const BlockBackgroundUnconnected = ({
  id, name, attachComponent, addPiece, removePiece, className, title, src, bgColor, bgSize, bgRepeat, bgPosition, children,
}: WriteAwayBackgroundBlockData & IReactActionProps<WriteAwayBackgroundBlockData> & IReactPieceProps & { className?: string, children: any }) => {
  const [node, setNode] = useState<HTMLDivElement | undefined>(undefined);
  useEffect(() => {
    attachComponent('background', BackgroundImageEditor);
    return () => {
      removePiece(id);
    };
  }, [id]);

  useEffect(() => {
    if (node) {
      addPiece({
        id,
        type: 'background',
        name,
        node,
        data: {
          title, src, bgRepeat, bgSize, bgColor, bgPosition,
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
  return (
    <div
      title={title}
      className={className}
      ref={setElement}
      style={{
        backgroundImage: src ? `url(${src})` : '',
        backgroundPosition: bgPosition,
        backgroundColor: bgColor,
        backgroundSize: bgSize,
        backgroundRepeat: bgRepeat,
      }}
    >
      {children}
    </div>
  );
};

export const BlockBackgroundReact = connectDynamicActions(BlockBackgroundUnconnected);
