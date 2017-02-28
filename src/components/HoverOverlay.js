import React, {Component} from "react";

export default class HoverOverlay extends React.Component {

    render() {
        let componentName = this.props.hoveredPiece ? (this.props.components[this.props.hoveredPiece.type].__name) : false;
        let hoverRectStyles = this.getHoverRectStyles();
        const overlayClass = `r_pointer-div ${hoverRectStyles.className}`;
        delete hoverRectStyles.className;

        return (
            <div ref="overlay" className="r_overlay">
                <div className={overlayClass} style={hoverRectStyles}>
                    <div className="r_pointer-div-label"><i className="r_icon-pencil r_btn">&nbsp;</i>{componentName}
                    </div>
                    <div className="r_pointer-edit-icon"></div>
                </div>
            </div>
        )
    }

    getHoverRectStyles() {
        const padding = 10;
        let shrinked = false;
        if (this.props.enabled && this.props.hoveredId) {
            let base = {
                className: 'normal',
                top: (this.props.hoveredRect.top - padding + window.scrollY),
                left: (this.props.hoveredRect.left - padding),
                width: (this.props.hoveredRect.right - this.props.hoveredRect.left + 2 * padding),
                height: (this.props.hoveredRect.bottom - this.props.hoveredRect.top + 2 * padding),
            };
            if (base.left < 0 || base.top < 0 || base.width + base.left > document.body.scrollWidth || base.height + base.top > document.body.scrollHeight) {
                /**
                 * We are overflowing, switch to shrinked styles
                 */
                shrinked = true;
                base = {
                    className: 'shrinked',
                    top: (this.props.hoveredRect.top + window.scrollY),
                    left: (this.props.hoveredRect.left ),
                    width: (this.props.hoveredRect.right - this.props.hoveredRect.left),
                    height: (this.props.hoveredRect.bottom - this.props.hoveredRect.top),
                };
            }

            return {
                opacity: 1,
                className: base.className,
                top: base.top + "px",
                left: base.left + "px",
                width: base.width + "px",
                height: base.height + "px",
            };
        } else {
            return {
                opacity: 0,
                className: "none",
                top: window.scrollY + "px",
                left: 0,
                width: "100%",
                height: "100%"
            }
        }
    }

}
