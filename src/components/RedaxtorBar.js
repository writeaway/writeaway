import React from "react"
import ReactDOM from "react-dom"

import {Tabs, Tab} from 'material-ui/lib/tabs'
import Toggle from 'material-ui/lib/toggle'
import RaisedButton from 'material-ui/lib/raised-button'
import FontIcon from 'material-ui/lib/font-icon'
import {indigo50} from 'material-ui/lib/styles/colors'

import PiecesList from './PiecesList'

export default class RedaxtorBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: 'pieces',
            dragging: false
        };
    }

    componentDidMount() {
        this._node = ReactDOM.findDOMNode(this.refs["bar"])
        this._rel = {x: 0, y: 0}
    }

    componentDidUpdate(props, state) {
        if (this.state.dragging && !state.dragging) {
            document.addEventListener('mousemove', this.onMouseMove.bind(this))
            document.addEventListener('mouseup', this.onMouseUp.bind(this))
        } else if (!this.state.dragging && state.dragging) {
            document.removeEventListener('mousemove', this.onMouseMove.bind(this))
            document.removeEventListener('mouseup', this.onMouseUp.bind(this))
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

    render() {
        const tabStyle = {
            height: "30px",
            verticalAlign: "top"
        }
        const barStyle = {
            position: "fixed", top: 0, left: 0, background: "#eee", color: "#222", "zIndex": 1000, width: "320px"
        }
        const handleStyle = {
            height: "20px",
            cursor: "move",
            backgroundColor: indigo50
        }
        return (
            <div ref="bar" className="redaxtor-bar" style={barStyle}>

                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
                
                <div className="redaxtor-bar-handler" style={handleStyle}
                     onMouseDown={this.onMouseDown.bind(this)}></div>

                <Tabs value={this.state.value} onChange={this.handleTabChange.bind(this)}
                      tabItemContainerStyle={{height: "30px"}} contentContainerStyle={{padding: "10px"}}>

                    <Tab label="Pieces" value="pieces" onClick={()=>this.setState({value: "pieces"})} style={tabStyle}>
                        <Toggle label="Edit" defaultToggled={this.props.edit} onToggle={this.props.handleToggleEdit}/>
                        <div>Edit: {this.props.edit.toString()}</div>
                        <div>Pieces: {Object.keys(this.props.pieces).length}</div>
                        <PiecesList edit={this.props.edit} pieces={this.props.pieces} components={this.props.components}
                                    savePiece={this.props.savePiece} updatePiece={this.props.updatePiece}/>
                        <RaisedButton label="Save all pieces" secondary={true}
                                      onClick={()=>this.props.handleSavePieces(this.props.pieces)}/>
                    </Tab>

                    <Tab label="i18n" value="i18n" onClick={()=>this.setState({value: "i18n"})} style={tabStyle}>
                        <RaisedButton label="Save all I18N" secondary={true} onClick={()=>this.handleSaveI18N()}/>
                    </Tab>

                    <Tab label="Pages" value="pages" onClick={()=>this.setState({value: "pages"})}
                         style={tabStyle}></Tab>

                    <Tab value="settings" onClick={()=>this.setState({value: "settings"})}
                         icon={<FontIcon className="material-icons">settings</FontIcon>} style={tabStyle}>
                    </Tab>
                </Tabs>
            </div>
        )
    }
}