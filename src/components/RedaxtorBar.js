import React from "react"
import ReactDOM from "react-dom"

import {Tabs, Tab} from 'material-ui/lib/tabs'
import Toggle from 'material-ui/lib/toggle'
import RaisedButton from 'material-ui/lib/raised-button'

import PiecesList from './PiecesList'
import PanelHandler from './PanelHandler'
import Pages from './Pages'

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

    savePiece(html) {
        let id = this.props.currentSourcePieceId;
        this.props.updatePiece(id, {data: {html: html}});
        this.props.savePiece(id);
        this.props.setCurrentSourcePieceId(null);
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

        var sourceEditor = null;
        if (this.props.components.source && this.props.currentSourcePieceId) {
            sourceEditor = <this.props.components.source
                html={this.props.pieces[this.props.currentSourcePieceId].data.html}
                onClose={()=>this.props.setCurrentSourcePieceId(null)}
                onSave={(html)=>this.savePiece(html)}/>
        }
        return (
            <div style={{all: 'initial'}}>
                <div ref="bar" className="redaxtor-bar" style={barStyle}>
                    {sourceEditor}

                    <PanelHandler isOpen={this.state.isOpen}
                                  onMouseDown={this.onMouseDown.bind(this)}
                                  toggleOpen={this.toggleOpen.bind(this)}/>

                    { this.state.isOpen ? <Tabs value={this.state.value} onChange={this.handleTabChange.bind(this)}
                          tabItemContainerStyle={{height: "30px"}} contentContainerStyle={{padding: "10px"}}>

                        <Tab label={"Pieces: " + Object.keys(this.props.pieces).length} value="pieces"
                             onClick={()=>this.setState({value: "pieces"})} style={tabStyle}>

                            <Toggle label="Edit" defaultToggled={this.props.edit}
                                    onToggle={this.props.handleToggleEdit}/>

                            <PiecesList edit={this.props.edit} pieces={this.props.pieces}
                                        components={this.props.components}
                                        savePiece={this.props.savePiece} updatePiece={this.props.updatePiece}
                                        setCurrentSourcePieceId={this.props.setCurrentSourcePieceId}/>
                            <RaisedButton label="Save all pieces" secondary={true}
                                          onClick={()=>this.props.handleSavePieces(this.props.pieces)}/>
                        </Tab>

                        <Tab label="i18n" value="i18n" onClick={()=>this.setState({value: "i18n"})} style={tabStyle}>
                            <RaisedButton label="Save all I18N" secondary={true} onClick={()=>this.handleSaveI18N()}/>
                        </Tab>

                        <Tab label="Pages" value="pages" onClick={()=>this.setState({value: "pages"})}
                             style={tabStyle}>
                            <Pages addPage={data=>this.props.addPage(data)}/>
                        </Tab>
                    </Tabs> : null}
                </div>
            </div>
        )
    }
}