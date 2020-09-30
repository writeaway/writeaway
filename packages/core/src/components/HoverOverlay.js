import React, {Component} from "react";
import classNames from "classnames";

export default class HoverOverlay extends React.Component {

    render() {
        let componentLabel = this.props.hoveredPiece ? (this.props.components[this.props.hoveredPiece.type].__editLabel) : false;
        let hoverRectStyles = this.getHoverRectStyles();
        const overlayClass = `r_pointer-div ${hoverRectStyles.className}`;
        delete hoverRectStyles.className;

        return (
            <div className="r_reset">
                <div ref="overlay" className={classNames({'r_overlay': true, 'r_active-editor': this.props.triggeredByActionId})}>
                    <div className={overlayClass} style={hoverRectStyles}>
                        {!this.props.triggeredByActionId &&
                        <div className="r_pointer-div-label">{componentLabel}
                        </div>
                        }
                        <div className="r_pointer-edit-icon"></div>
                    </div>
                </div>
            </div>
        )
    }

    getHoverRectStyles() {
        let shrinked = false;
        const labelHeight = 27;

        if (this.props.enabled && this.props.hoveredId) {
            let base = {
                className: 'normal',
                top: (this.props.hoveredRect.top + window.scrollY),
                left: (this.props.hoveredRect.left + window.scrollX),
                width: (this.props.hoveredRect.right - this.props.hoveredRect.left),
                height: (this.props.hoveredRect.bottom - this.props.hoveredRect.top),
            };
            if (base.left <= 0 || base.top <= 0 || base.width + base.left >= document.body.scrollWidth || base.height + base.top >= document.body.scrollHeight) {
                /**
                 * We are touching edges, switch to shrinked styles
                 */
                shrinked = true;
                base.className = 'shrinked';
            }

            if(this.props.hoveredRect.top - labelHeight < 0 && this.props.hoveredRect.bottom + labelHeight> window.innerHeight) {
                base.className += ' too-high';
            }

            if(this.props.hoveredRect.top - labelHeight < 0) {
                base.className+= ' touches-top';
            }

            if(this.props.hoveredRect.bottom + labelHeight > window.innerHeight) {
                base.className+= ' touches-bottom';
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
