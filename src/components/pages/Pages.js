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
        let page = this.props.list[this.props.currentEditIndex];
        let field;
        if (page.data.layout && page.data.layout.data) {
            field = {...this.props.layouts[page.data.layout].data.fields[fieldName], value: value}
        } else {
            field = {value: value};
        }
        this.props.pageDataFieldsUpdate(this.props.currentEditIndex, {...page.fields, [fieldName]: field});
    }

    render() {
        const height = 20;
        const buttonStyle = {float: 'right', width: 20, height: height, padding: 1};//note float right changes order
        const iconStyle = {width: height - 2, height: height - 2};
        let list = this.props.list;
        let currenIndex = this.props.currentEditIndex;

        var pageDialog = currenIndex > -1 &&
            <PageDialog page={list[currenIndex]}
                        layouts={this.props.layouts}
                        pageSetCurrentIndex={this.props.pageSetCurrentIndex}
                        savePage={()=>this.props.savePage(currenIndex)}
                        pageDataUpdate={data=>this.props.pageDataUpdate(currenIndex, data)}
                        pageDataFieldsSet={fields=>this.props.pageDataFieldsSet(currenIndex, fields)}
                        pageFieldUpdate={this.pageFieldUpdate.bind(this)}
                        pageUpdate={data=>this.props.pageUpdate(currenIndex, data)}
            />;
        var createPage = this.props.allowCreate &&
            <IconButton
                onClick={()=>this.props.pageStartCreating({data: {fields: {title: {value: 'New Page'}, url: {value: ''}}}})}>
                <AddPage/>
            </IconButton>;
        return (
            <div>
                {createPage}
                {list && Object.keys(list).map(id =>
                    (
                        <div key={id} style={{padding: '2px 0'}}>
                            <span style={{display: 'inline-block', height: height}}>
                                {list[id].data.fields.title.value}
                            </span>
                            <IconButton style={buttonStyle} iconStyle={iconStyle} tooltipPosition="top-left"
                                        tooltip="Edit" onClick={()=>this.props.pageSetCurrentIndex(id)}>
                                <Edit/>
                            </IconButton>
                            <IconButton style={buttonStyle} iconStyle={iconStyle} tooltipPosition="top-left"
                                        tooltip="Delete" onClick={()=>this.props.pageDelete(id)}>
                                <Delete/>
                            </IconButton>
                        </div>))
                }
                {pageDialog}
            </div>
        );

    }
}

Pages.propTypes = {
    allowCreate: React.PropTypes.bool.isRequired
};
