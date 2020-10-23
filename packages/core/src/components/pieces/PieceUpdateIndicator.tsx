import React, { useEffect, useState } from 'react';
import { IMeta, IPieceItem, Rect } from 'types';

export const PieceUpdateIndicator = ({
  piece, meta, isNodeVisible, getNodeRect,
}: {
  piece: IPieceItem,
  meta: Partial<IMeta>,
  isNodeVisible: (piece: IPieceItem) => boolean,
  getNodeRect: (piece: IPieceItem) => { node: Rect, hover?: Rect },
}) => {
  const [current, setCurrent] = useState<Partial<IMeta>>(meta);
  const [className, setClassName] = useState<string>('');
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (
      piece.meta?.time
       && piece.meta?.time >= (current.time || 0)
       && piece.meta?.id !== meta.id
    ) {
      setCurrent(piece.meta);
      const isVisible = isNodeVisible(piece);
      if (isVisible) {
        const { hover, node } = getNodeRect(piece);
        const result = hover || node;
        setClassName('r_node_was_updated');
        setStyle({
          top: `${result.top}px`,
          left: `${result.left}px`,
          width: `${result.width}px`,
          height: `${result.height}px`,
        });
      }
    }
    const timer = setTimeout(() => {
      setClassName('');
    }, 2000);
    return () => { clearTimeout(timer); };
  }, [piece.meta?.time]);
  return (
    <div className={`r_reset r_node_update_hover ${className}`} style={style}>
      {!!(piece.meta?.label) && (
      <div className="r_node_update_label">
        Updated by:
        {piece.meta.label}
      </div>
      ) }
    </div>
  );
};
