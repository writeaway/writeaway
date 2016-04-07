import React from "react"
import ReactDOM from "react-dom"

import {Tabs, Tab} from 'material-ui/lib/tabs'
import RaisedButton from 'material-ui/lib/raised-button'
import Snackbar from 'material-ui/lib/snackbar';

import PanelHandler from './PanelHandler'
import Pieces from './pieces/PiecesContainer'
import Pages from './pages/PagesContainer'
import I18N from './i18n/I18NContainer'
import ImageInsert from './imageInsert'

export default class RedaxtorBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: 'pieces',
            dragging: false,
            isOpen: false
        };
    }

    componentDidMount() {
        this._node = ReactDOM.findDOMNode(this.refs["bar"])
        this._rel = {x: 0, y: 0}
    }

    componentDidUpdate(props, state) {
        if (this.state.dragging && !state.dragging) {
            this._onMouseMove = this.onMouseMove.bind(this);
            this._onMouseUp = this.onMouseUp.bind(this);
            document.addEventListener('mousemove', this._onMouseMove)
            document.addEventListener('mouseup', this._onMouseUp)
        } else if (!this.state.dragging && state.dragging) {
            document.removeEventListener('mousemove', this._onMouseMove)
            document.removeEventListener('mouseup', this._onMouseUp)
        }
    }

    handleTabChange(e) {
        //todo doesn't work - bug in mui 15 alpha
        this.setState({
            value: e.value
        });
    };

    handleSaveI18N() {
        console.log("handleSaveI18N", this.props.I18N);
        // Object.keys(this.props.I18N).forEach(id => {
        //     const piece = this.props.pieces[id]
        //     console.log("Save piece:", piece);
        // })
    }

    onMouseDown(e) {
        // only left mouse button
        if (e.button !== 0) return
        this._rel.x = e.pageX - this._node.offsetLeft;
        this._rel.y = e.pageY - this._node.offsetTop;
        this.setState({dragging: true})
        e.stopPropagation()
        e.preventDefault()
    }

    onMouseMove(e) {
        if (!this.state.dragging) return
        this._node.style.left = e.pageX - this._rel.x + "px";
        this._node.style.top = e.pageY - this._rel.y + "px";
        e.stopPropagation()
        e.preventDefault()
    }

    onMouseUp(e) {
        this.setState({dragging: false})
        e.stopPropagation()
        e.preventDefault()
    }

    toggleOpen() {
        this.setState({isOpen: !this.state.isOpen})
    }

    render() {
        const tabStyle = {height: "30px", verticalAlign: "top"}
        const barStyle = {
            position: "fixed", top: 0, left: 0, background: "#eee", color: "#222", "zIndex": 1000, width: "320px",
            borderRadius: "2px",
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell",' +
            ' "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'
        }
        var tabs = [];
        this.props.piecesTabVisible && tabs.push(<Tab label={"Pieces"} value="pieces"
                       onClick={()=>this.setState({value: "pieces"})} style={tabStyle}>
            <Pieces components={this.props.components}/>
        </Tab>)
        this.props.i18nTabVisible && tabs.push(<Tab label="i18n" value="i18n" onClick={()=>this.setState({value: "i18n"})} style={tabStyle}>
            <I18N/>
        </Tab>)
        this.props.pagesTabVisible && tabs.push(<Tab label="Pages" value="pages" onClick={()=>this.setState({value: "pages"})}
                       style={tabStyle}>
            <Pages/>
        </Tab>)
        return (
            <div style={{all: 'initial'}}>
                <div ref="bar" className="redaxtor-bar" style={barStyle}>
                    <PanelHandler isOpen={this.state.isOpen}
                                  onMouseDown={this.onMouseDown.bind(this)}
                                  toggleOpen={this.toggleOpen.bind(this)}/>

                    { this.state.isOpen ? <Tabs value={this.state.value} onChange={this.handleTabChange.bind(this)}
                                                tabItemContainerStyle={{height: "30px"}}
                                                contentContainerStyle={{padding: "10px"}}>
                        {tabs}
                    </Tabs> : null}
                </div>
                <Snackbar
                    open={!!this.props.message}
                    message={this.props.message&&this.props.message.content||""}
                    autoHideDuration={this.props.message&&this.props.message.durationTime||4000}
                    onRequestClose={()=>{this.props.hideMessage()}}
                />
                <ImageInsert/>

            </div>
        )
    }
}