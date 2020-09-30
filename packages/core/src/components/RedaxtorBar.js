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

    render() {

        let isCollapsed = this.props.navBarCollapsed != undefined && this.props.navBarCollapsed != null ? this.props.navBarCollapsed : true;
        let piecesOptions = {
            pieceNameGroupSeparator: this.props.options.pieceNameGroupSeparator
        };

        const r_bar_class = classNames({
            "r_bar": true,
            "rx_non-expert": !this.props.expert,
        });

        return (
            <div className="r_reset">
                <div ref="bar" className={r_bar_class}>
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