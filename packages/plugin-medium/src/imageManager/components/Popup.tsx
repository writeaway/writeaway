import React from 'react';
import classNames from 'classnames';

export const Popup = ({ contentClass, children }: { contentClass?: string, children: any }) => {
  const [show, setShow] = React.useState<boolean>(false);
  React.useEffect(() => {
    setShow(true);
  }, []);

  const contentClasses = `r_modal-content ${contentClass}` ?? '';
  return (
    <div className={classNames({ 'r_modal-overlay': true, r_reset: true, r_visible: show })}>
      <div className={contentClasses}>
        {children}
      </div>
    </div>
  );
};

export default Popup;
