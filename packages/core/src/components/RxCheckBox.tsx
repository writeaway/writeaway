import React from 'react';
import classNames from 'classnames';

export const RxCheckBox = ({ checked, onChange, disabled }: {
  checked: boolean,
  // eslint-disable-next-line react/require-default-props
  onChange?: (e: React.SyntheticEvent) => void,
  // eslint-disable-next-line react/require-default-props
  disabled?: boolean
}) => {
  const styles = {
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'default' : 'pointer',
  };
  return (
    <div className="r_checkbox r_item-right">
      <div
        aria-label="Check"
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
