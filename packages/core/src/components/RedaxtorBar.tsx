import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';

import classNames from 'classnames';

import PanelHandler from './PanelHandler';
import Pieces from './pieces/PiecesContainer';

export interface RedaxtorBarProps {
  options: {
    navBarDraggable: boolean,
    navBarCollapsable: boolean,
    pieceNameGroupSeparator: string,
  },
  message?: {
    content: string,
    type: string,
  },
  navBarCollapsed: boolean,
  expert: boolean,
  piecesToggleNavBar: () => void,
}

export const RedaxtorBar = (
  {
    message,
    navBarCollapsed,
    piecesToggleNavBar,
    options,
    expert,
  }: RedaxtorBarProps,
) => {
  const [dragging, setDragging] = useState<boolean>(false);
  const [dragged, setDragged] = useState<boolean>(false);
  const value = 'pieces';
  const node = useRef<HTMLDivElement>(null);
  const rel = useRef<{
    x: number,
    y: number,
    startX: number,
    startY: number
  }>({
    x: 0, y: 0, startX: 0, startY: 0,
  });

  const onMouseUp = useCallback((e: MouseEvent) => {
    // ignore if don't set draggable option
    if (!options.navBarDraggable || !dragging) {
      return;
    }
    setDragging(false);
    e.stopPropagation();
    e.preventDefault();
  }, [setDragging, options.navBarDraggable, dragging]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    // ignore if don't set draggable option
    if (!options.navBarDraggable) {
      return;
    }

    // only left mouse button
    if (e.button !== 0) return;
    rel.current = {
      x: e.pageX - node.current!.offsetLeft,
      y: e.pageY - node.current!.offsetTop,
      startX: e.pageX,
      startY: e.pageY,
    };

    setDragged(false);
    setDragging(true);
    e.stopPropagation();
    e.preventDefault();
  }, [setDragging, options.navBarDraggable]);

  const toggleOpen = useCallback(() => {
    // ignore if don't set draggable option
    if (!options.navBarCollapsable) {
      return;
    }
    if (!dragged) {
      piecesToggleNavBar();
    }
  }, [setDragged, piecesToggleNavBar]);

  const onMouseMove = useCallback((e: MouseEvent) => {
    // ignore if don't set draggable option
    if (!options.navBarDraggable || !dragging) {
      return;
    }
    if (e.pageX === rel.current?.startX && e.pageY === rel.current?.startY) {
      return;
    }
    node.current!.style.left = `${e.pageX - rel.current!.x}px`;
    node.current!.style.top = `${e.pageY - rel.current!.y}px`;
    setDragged(true);
    e.stopPropagation();
    e.preventDefault();
  }, [options.navBarDraggable, dragging]);

  useEffect(() => {
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseUp]);

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, [onMouseMove]);

  const rBarClass = classNames({
    r_bar: true,
    'rx_non-expert': !expert,
  });

  const isCollapsed = navBarCollapsed ?? true;

  return (
    <div className="r_reset">
      <div
        ref={node}
        className={rBarClass}
      >
        <PanelHandler
          isCollapsable={options.navBarCollapsable}
          isOpen={!isCollapsed}
          onMouseDown={onMouseDown}
          toggleOpen={toggleOpen}
          message={message}
        />

        {!isCollapsed
          ? (
            <div className="r_tabs" data-value={value}>
              <div className="r_tab-content">
                {value === 'pieces'
                && <Pieces />}
              </div>
            </div>
          ) : null}
      </div>
    </div>
  );
};
