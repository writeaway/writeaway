import React from 'react';
import classNames from 'classnames';

export interface RxCheckBoxProps {
  checked: boolean,
  onChange?: (e: React.MouseEvent<HTMLDivElement>) => void,
  disabled?: boolean
}

export const RxCheckBox = ({ checked, onChange, disabled }: RxCheckBoxProps) => {
  const styles = {
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'default' : 'pointer',
  };

  return (
    <div className="r_checkbox r_item-right">
      <div
        role="button"
        tabIndex={-1}
        style={styles}
        className={classNames({
          rx_icon: true,
          'rx_icon-circle-thin': !checked,
          'rx_icon-check_circle': checked,
        })}
        onClick={onChange}
      />
    </div>
  );
};
