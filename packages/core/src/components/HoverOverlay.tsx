import React, { CSSProperties, useMemo } from 'react';
import classNames from 'classnames';
import {
  IComponent, IPieceItem, PieceType, Rect,
} from 'types';

export interface OverlayProps {
  triggeredByActionId: boolean,
  hoveredPiece?: IPieceItem,
  hoveredId?: string,
  hoveredRect?: Rect,
  enabled: boolean,
  components: Partial<Record<PieceType, IComponent>>
}

export interface HoverOverlayComponentProps {
  overlayWrapClass: string,
  overlayClass: string,
  style: CSSProperties,
  triggeredByActionId: boolean,
  componentLabel?: string,
  componentMessage?: { message: string; type?: string }
}

export const HoverOverlayComponent = ({
  overlayWrapClass,
  overlayClass,
  style,
  triggeredByActionId,
  componentLabel,
  componentMessage,
}: HoverOverlayComponentProps) => (
  <div className="redaxtor-overlay r_reset">
    <div className={overlayWrapClass}>
      <div className={overlayClass} style={style}>
        {!triggeredByActionId
        && (
          <div className="r_pointer-div-label">
            {componentLabel}
            {componentMessage
            && (
              <div className={`r_pointer-div-message r_pointer-div-message-${componentMessage.type}`}>
                {componentMessage.message}
              </div>
            )}
          </div>
        )}
        <div className="r_pointer-edit-icon" />
      </div>
    </div>
  </div>
);

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
      if (
        base.style.left <= 0
        || base.style.top <= 0
        || base.style.width + base.style.left >= document.body.scrollWidth
        || base.style.height + base.style.top >= document.body.scrollHeight) {
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

  const componentLabel = hoveredPiece ? (components[hoveredPiece.type]?.editLabel) : undefined;
  const componentMessage = (hoveredPiece?.message) ? { message: hoveredPiece?.message, type: hoveredPiece?.messageLevel } : undefined;

  const overlayClass = `r_pointer-div ${className}`;
  const overlayWrapClass = classNames({ r_overlay: true, 'r_active-editor': triggeredByActionId });

  return (
    <HoverOverlayComponent
      overlayWrapClass={overlayWrapClass}
      overlayClass={overlayClass}
      style={style}
      triggeredByActionId={triggeredByActionId}
      componentLabel={componentLabel}
      componentMessage={componentMessage}
    />
  );
};
