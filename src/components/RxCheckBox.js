import React, {Component} from "react";
import classNames from "classnames";

export default class RxCheckBox extends React.Component {

    render() {
        const {checked, onChange, disabled} = this.props;

        const styles = {
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? "default" : "pointer"
        };

        return (
            <div className="r_checkbox">
                <div style={styles} className={classNames({
                    "rx_icon": true,
                    "rx_icon-circle-thin": !checked,
                    "rx_icon-check_circle": checked
                })} onClick={onChange}>
                </div>
            </div>
        )
    }
}
