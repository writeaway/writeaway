import React, { useMemo } from 'react';
import classNames from 'classnames';
import {
  IComponent, IPiece, PieceType, Rect,
} from 'types';

export interface OverlayProps {
  triggeredByActionId: boolean,
  hoveredPiece?: IPiece,
  hoveredId?: string,
  hoveredRect?: Rect,
  enabled: boolean,
  components: Partial<Record<PieceType, IComponent>>
}

export const HoverOverlay = ({
  components, hoveredId, hoveredRect, enabled, hoveredPiece, triggeredByActionId,
}: OverlayProps) => {
  const { style, className } = useMemo(() => {
    // let shrinked = false;
    const labelHeight = 27;

    if (enabled && hoveredId && hoveredRect) {
      const base = {
        className: 'normal',
        style: {
          top: (hoveredRect.top + window.scrollY),
          left: (hoveredRect.left + window.scrollX),
          width: (hoveredRect.right - hoveredRect.left),
          height: (hoveredRect.bottom - hoveredRect.top),
        },
      };
      if (base.style.left <= 0 || base.style.top <= 0 || base.style.width + base.style.left >= document.body.scrollWidth || base.style.height + base.style.top >= document.body.scrollHeight) {
        /**
         * We are touching edges, switch to shrinked styles
         */
        // shrinked = true;
        base.className = 'shrinked';
      }

      if (hoveredRect.top - labelHeight < 0 && hoveredRect.bottom + labelHeight > window.innerHeight) {
        base.className += ' too-high';
      }

      if (hoveredRect.top - labelHeight < 0) {
        base.className += ' touches-top';
      }

      if (hoveredRect.bottom + labelHeight > window.innerHeight) {
        base.className += ' touches-bottom';
      }

      return {
        className: base.className,
        style: {
          opacity: 1,
          top: `${base.style.top}px`,
          left: `${base.style.left}px`,
          width: `${base.style.width}px`,
          height: `${base.style.height}px`,
        },
      };
    }
    return {
      className: 'none',
      style: {
        opacity: 0,
        top: `${window.scrollY}px`,
        left: 0,
        width: '100%',
        height: '100%',
      },
    };
  }, [enabled, hoveredId, hoveredRect]);

  const componentLabel = hoveredPiece ? (components[hoveredPiece.type]?.editLabel) : false;

  const overlayClass = `r_pointer-div ${className}`;

  return (
    <div className="r_reset">
      <div className={classNames({ r_overlay: true, 'r_active-editor': triggeredByActionId })}>
        <div className={overlayClass} style={style}>
          {!triggeredByActionId
          && (
          <div className="r_pointer-div-label">
            {componentLabel}
          </div>
          )}
          <div className="r_pointer-edit-icon" />
        </div>
      </div>
    </div>
  );
};
