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

    pageFieldUpdate(fieldName, value) {
        let page = this.props.pages.list[this.props.pages.currentEditIndex];
        let field;
        if (page.data.layout) {
            field = {...this.props.pages.layouts[page.data.layout][fieldName], value: value}
        } else {
            field = {value: value};
        }
        this.props.pageDataFieldsUpdate(this.props.pages.currentEditIndex, {...page.fields, [fieldName]: field});
    }

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
                        pageFieldUpdate={this.pageFieldUpdate.bind(this)}
                        pageUpdate={data=>this.props.pageUpdate(this.props.pages.currentEditIndex, data)}
            />;
        return (
            <div>
                <IconButton onClick={()=>this.props.pageStartCreating(
                {data: {
                    fields: {title: {value: 'New Page'}, url: {value: ''}}
                    }
                })}>
                    <AddPage/>
                </IconButton>
                {this.props.pages.list &&
                Object.keys(this.props.pages.list).map(index=>
                    (
                        <div style={{padding: '2px 0'}}>
                            <span style={{display: 'inline-block', height: height}}>
                                {this.props.pages.list[index].data.fields.title.value}
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
