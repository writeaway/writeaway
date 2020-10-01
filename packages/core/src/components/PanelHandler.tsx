import React from 'react';
import i18n from '../i18n';

export interface IPanelHandlerProps {
  isCollapsable: boolean,
  onMouseDown: (e: React.MouseEvent) => void,
  toggleOpen: (e: React.MouseEvent) => void,
  isOpen: boolean,
  message?: {
    content: string
  }
}

export const PanelHandler = (
  { isCollapsable, toggleOpen, onMouseDown, isOpen, message }: IPanelHandlerProps
) => (
  <div className="r_bar-header" onMouseDown={onMouseDown} onClick={toggleOpen}>
    <span>{i18n.bar.title}</span>
    {isCollapsable &&
    <button className="r_bar-header-button">
      {isOpen ? <i className="rx_icon rx_icon-keyboard_arrow_down"></i> :
        <i className="rx_icon rx_icon-keyboard_arrow_up"></i>}
    </button>}
    {message ? <div className="r_message r_message-{this.prop.message.type}">{message.content}</div> : ''}
  </div>
);

export default PanelHandler
