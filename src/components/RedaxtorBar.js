import React from "react"
// import IconMenu from 'material-ui/lib/menus/icon-menu';
// import IconButton from 'material-ui/lib/icon-button';
// import FontIcon from 'material-ui/lib/font-icon';
// import NavigationExpandMoreIcon from 'material-ui/lib/svg-icons/navigation/expand-more';
// import MenuItem from 'material-ui/lib/menus/menu-item';
// import DropDownMenu from 'material-ui/lib/DropDownMenu';
// import RaisedButton from 'material-ui/lib/raised-button';
// import Toolbar from 'material-ui/lib/toolbar/toolbar';
// import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
// import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
// import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';

// import Tabs from 'material-ui/lib/tabs/tabs'
// import Tab from 'material-ui/lib/tabs/tab'
import {Tabs, Tab} from 'material-ui/src/tabs'
import Toggle from 'material-ui/src/toggle'
// import FlatButton from 'material-ui/src/flat-button'
import RaisedButton from 'material-ui/src/raised-button'
import PiecesList from './PiecesList'

export default class RedaxtorBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: 'pieces'
        };
    }

    handleTabChange(e) {
        //todo doesn't work - bug in mui 15 alpha
        this.setState({
            value: e.value
        });
    };

    // handleSavePieces() {
    //     Object.keys(this.props.pieces).forEach(id => {
    //         const piece = this.props.pieces[id]
    //         console.log("Save piece:", piece);
    //     })
    // }

    handleSaveI18N() {
        console.log("handleSaveI18N", this.props.I18N);
        // Object.keys(this.props.I18N).forEach(id => {
        //     const piece = this.props.pieces[id]
        //     console.log("Save piece:", piece);
        // })
    }

    render() {
        return (
            <div className="redaxtor-bar">
                <Tabs value={this.state.value} onChange={this.handleTabChange.bind(this)}>

                    <Tab label="Pieces" value="pieces" onClick={()=>this.setState({value: "pieces"})}>
                        <Toggle label="Edit" defaultToggled={this.props.edit} onToggle={this.props.handleToggleEdit}/>
                        <div>Edit: {this.props.edit.toString()}</div>
                        <div>Pieces: {Object.keys(this.props.pieces).length}</div>
                        <PiecesList edit={this.props.edit} pieces = {this.props.pieces} />
                        <RaisedButton label="Save all pieces" secondary={true} 
                                      onClick={()=>this.props.handleSavePieces(this.props.pieces)}/>
                    </Tab>

                    <Tab label="i18n" value="i18n" onClick={()=>this.setState({value: "i18n"})}>
                        <RaisedButton label="Save all I18N" secondary={true} onClick={()=>this.handleSaveI18N()}/>
                    </Tab>

                    <Tab label="Pages" value="pages" onClick={()=>this.setState({value: "pages"})}></Tab>

                    <Tab label="Settings" value="settings" onClick={()=>this.setState({value: "settings"})}></Tab>
                </Tabs>
            </div>
        )
    }
}