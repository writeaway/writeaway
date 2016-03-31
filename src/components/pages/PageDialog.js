import React from 'react'
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';
import IconButton from 'material-ui/lib/icon-button';
import AddPage from 'material-ui/lib/svg-icons/action/note-add';

export default class PageDialog extends React.Component {
    constructor(props) {
        super(props);
        this.data = {};
    }

    onTextChange(value) {
        this.setState({text: value});
    }

    render() {
        const actions = [
                <FlatButton label="Cancel" secondary={true} onClick={()=>{this.props.pageSetCurrentIndex(-1)}}/>,
                <FlatButton label="Submit" primary={true} onClick={this.props.savePage}/>
            ],
            customContentStyle = {
                width: '420px',
                left: 'calc(50% - 210px)'
            },
            SelectStyle = {
                outline: "none",
                border: "none",
                color: "rgba(0, 0, 0, 0.870588)",
                marginTop: "46px",
                backgroundColor: "rgba(0, 0, 0, 0)",
                borderBottom: "1px solid rgb(224, 224, 224)",
                paddingBottom: "5px",
                fontSize: "16px",
                lineHeight: "24px",
                width: "256px"
            };
        var layoutKey = Object.keys(this.props.layouts).filter(key=>(key === this.props.page.layout))[0];
        let fields = this.props.page.data.fields;
        return (
            <Dialog style={customContentStyle} title={fields.url?"Edit Page":"Add new Page"} actions={actions} modal={true}
                    open={true} autoDetectWindowHeight={true} autoScrollBodyContent={true}>
                <TextField onChange={e=>{this.props.pageFieldUpdate("title", e.target.value)}}
                           value={fields.title && fields.title.value||""} floatingLabelText="Title"/>
                <br/>
                <TextField onChange={e=>{this.props.pageFieldUpdate("url", e.target.value)}}
                           value={fields.url && fields.url.value||""} floatingLabelText="URL"/>
                <br/>
                <select onChange={e=>{this.props.pageDataUpdate({layout: e.target.value})}} style={SelectStyle}>
                    <option value='empty' hidden>Select Layout</option>
                    {Object.keys(this.props.layouts).map(key => {
                            return (
                                <option value={key}>{this.props.layouts[key].name}</option>
                            )
                        })}
                </select>
            </Dialog>
        );
    }
}
