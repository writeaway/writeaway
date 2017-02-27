import React from "react"
import ReactDOM from "react-dom"

import classNames from 'classnames';

import PanelHandler from './PanelHandler'
import Pieces from './pieces/PiecesContainer'
// import Pages from './pages/PagesContainer'
// import I18N from './i18n/I18NContainer'

export default class RedaxtorBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: 'pieces',
            dragging: false,
            isCollapsible: this.props.options.navBarCollapsable
        };

        this._onMouseMove = this.onMouseMove.bind(this);
        this._onMouseUp = this.onMouseUp.bind(this);
    }

    componentDidMount() {
        this._node = ReactDOM.findDOMNode(this.refs["bar"]);
        this._rel = {x: 0, y: 0, startX: 0, startY: 0};
    }

    componentDidUpdate(props, state) {
        if (this.state.dragging && !state.dragging) {
            document.addEventListener('mousemove', this._onMouseMove);
            document.addEventListener('mouseup', this._onMouseUp);
        } else if (!this.state.dragging && state.dragging) {
            document.removeEventListener('mousemove', this._onMouseMove);
            document.removeEventListener('mouseup', this._onMouseUp);
        }
    }

    onMouseDown(e) {
        //ignore if don't set draggable option
        if (!this.props.options.navBarDraggable) {
            return;
        }

        // only left mouse button
        if (e.button !== 0) return;
        this._rel.x = e.pageX - this._node.offsetLeft;
        this._rel.y = e.pageY - this._node.offsetTop;
        this._rel.startX = e.pageX;
        this._rel.startY = e.pageY;
        this.setState({dragging: true, dragged: false});
        e.stopPropagation();
        e.preventDefault();
    }

    onMouseMove(e) {
        //ignore if don't set draggable option
        if (!this.props.options.navBarDraggable) {
            return;
        }

        if (!this.state.dragging) return;
        if (e.pageX == this._rel.startX && e.pageY == this._rel.startY) {
            return;
        }
        this._node.style.left = e.pageX - this._rel.x + "px";
        this._node.style.top = e.pageY - this._rel.y + "px";
        this.setState({dragged: true});
        e.stopPropagation();
        e.preventDefault();
    }

    onMouseUp(e) {
        //ignore if don't set draggable option
        if (!this.props.options.navBarDraggable) {
            return;
        }

        this.setState({dragging: false});
        e.stopPropagation();
        e.preventDefault();
    }

    toggleOpen() {
        //ignore if don't set draggable option
        if (!this.props.options.navBarCollapsable) {
            return;
        }
        if (!this.state.dragged) {
            this.props.piecesToggleNavBar();
        } else {
            this.setState({dragged: false});
        }
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

    render() {
        let componentName = this.props.hoveredPiece ? (this.props.components[this.props.hoveredPiece.type].__name) : false;
        let isCollapsed = this.props.navBarCollapsed != undefined && this.props.navBarCollapsed != null ? this.props.navBarCollapsed : true;
        let piecesOptions = {
            pieceNameGroupSeparator: this.props.options.pieceNameGroupSeparator
        };
        let hoverRectStyles = this.getHoverRectStyles();
        const overlayClass = `r_pointer-div ${hoverRectStyles.className}`;
        delete hoverRectStyles.className;
        const hoverLabel = this.props.hoveredPiece ? (this.props.hoveredPiece.name || this.props.hoveredPiece.id) : false;

        return (
            <div className="r_reset">

                <div ref="overlay" className="r_overlay">
                    <div className={overlayClass} style={hoverRectStyles}>
                        <div className="r_pointer-div-label"><i className="r_icon-pencil r_btn">&nbsp;</i>{componentName}</div>
                        <div className="r_pointer-edit-icon"></div>
                    </div>
                </div>

                <div ref="bar" className="r_bar">
                    <PanelHandler isCollapsable={this.state.isCollapsible}
                                  isOpen={!isCollapsed}
                                  onMouseDown={this.onMouseDown.bind(this)}
                                  toggleOpen={this.toggleOpen.bind(this)} message={this.props.message}/>

                    {!isCollapsed ?
                        <div className="r_tabs" value={this.state.value}>
                            <div className="r_tab-content">
                                {this.state.value === "pieces" &&
                                <Pieces components={this.props.components} options={piecesOptions}/>}
                            </div>
                        </div> : null}
                </div>
            </div>
        )
    }
}