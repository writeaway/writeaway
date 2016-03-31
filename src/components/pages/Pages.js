import React from 'react'
// import Dialog from 'material-ui/lib/dialog';
// import FlatButton from 'material-ui/lib/flat-button';
// import TextField from 'material-ui/lib/text-field';
import IconButton from 'material-ui/lib/icon-button';
import AddPage from 'material-ui/lib/svg-icons/action/note-add';
import Edit from 'material-ui/lib/svg-icons/editor/mode-edit';
import Delete from 'material-ui/lib/svg-icons/action/delete';

import PageDialog from './PageDialog'

export default class Pages extends React.Component {
    render() {
        const height = 20;
        const buttonStyle = {float: 'right', width: 20, height: height, padding: 1};//note float right changes order
        const iconStyle = {width: height - 2, height: height - 2};
        var pageDialog = this.props.pages.currentEditIndex > -1 &&
            <PageDialog page={this.props.pages.list[this.props.pages.currentEditIndex]}
                        layouts={this.props.pages.layouts}
                        pageSetCurrentIndex={this.props.pageSetCurrentIndex}
                        savePage={()=>this.props.savePage(this.props.pages.currentEditIndex)}
                        pageDataUpdate={data=>this.props.pageDataUpdate(this.props.pages.currentEditIndex, data)}
                        pageUpdate={data=>this.props.pageUpdate(this.props.pages.currentEditIndex, data)}
            />;
        return (
            <div>
                <IconButton onClick={()=>this.props.pageStartCreating({fields:{title: 'New Page', url: ''}})}>
                    <AddPage/>
                </IconButton>
                {this.props.pages.list &&
                Object.keys(this.props.pages.list).map(index=>
                    (
                        <div style={{padding: '2px 0'}}>
                            <span style={{display: 'inline-block', height: height}}>
                                {this.props.pages.list[index].fields.title}
                            </span>
                            <IconButton style={buttonStyle} iconStyle={iconStyle} tooltipPosition="top-left"
                                        tooltip="edit" onClick={()=>this.props.pageSetCurrentIndex(index)}>
                                <Edit/>
                            </IconButton>
                            <IconButton style={buttonStyle} iconStyle={iconStyle} tooltipPosition="top-left"
                                        tooltip="delete" onClick={()=>this.props.pageDelete(index)}>
                                <Delete/>
                            </IconButton>
                        </div>))
                }
                {pageDialog}
            </div>
        );

    }
}
