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

    onLayoutChange(layoutId) {
        if (this.props.layouts[layoutId].data && this.props.layouts[layoutId].data.fields) {
            let newFields = {
                ...this.props.layouts[layoutId].data.fields,
                url: this.props.page.data.fields.url,
                title: this.props.page.data.fields.title
            };
            this.props.pageDataFieldsSet(newFields)
        }
        this.props.pageDataUpdate({layout: layoutId})
    }

    renderNodes(options, key) {
        if (key === 'title' || key === 'url') return null;
        var nodeToReturn = null;
        switch (options.type) {
            case 'textarea':
                nodeToReturn =
                    <TextField key={key} id={"field" + key}
                               onChange={e=>{this.props.pageFieldUpdate(key, e.target.value)}}
                               value={options.value||""}
                               floatingLabelText={options.title||""} hintText={options.placeholder||""} rows={2}
                               rowsMax={4} multiLine={true}/>
                break;
            case 'input':
                nodeToReturn =
                    <TextField key={key} id={"field" + key}
                        onChange={e=>{this.props.pageFieldUpdate(key, e.target.value)}} value={options.value||""}
                        floatingLabelText={options.title||""} hintText={options.placeholder||""}/>;
                break
            case 'select':
                const SelectStyle = {
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
                    },
                    SelectLabelStyle = {
                        position: "absolute",
                        lineHeight: "22px",
                        transform: "perspective(1px) scale(0.75) translate3d(0px, -28px, 0px)",
                        transformOrigin: "left top 0px",
                        pointerEvents: "none",
                        color: "rgba(0, 0, 0, 0.498039)",
                        top: "38px"
                    };
                var emptyNode = !options.value ? <option value='empty' hidden>Select Layout</option> : null;
                nodeToReturn =
                    <div key={key} style={{height: "72px", position: "relative"}}>
                        <label style={SelectLabelStyle}>{options.title || ""}</label>
                        <select onChange={e=>{this.props.pageFieldUpdate(key, e.target.value)}} style={SelectStyle}
                                value={options.value||""}>
                            {emptyNode}
                            {Object.keys(options.options).map(key =><option
                                value={key}>{options.options[key]}</option>)}
                        </select>
                    </div>
                break;

        }
        return nodeToReturn;
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
            },
            SelectLabelStyle = {
                position: "absolute",
                lineHeight: "22px",
                transform: "perspective(1px) scale(0.75) translate3d(0px, -28px, 0px)",
                transformOrigin: "left top 0px",
                pointerEvents: "none",
                color: "rgba(0, 0, 0, 0.498039)",
                top: "38px"
            };
        //var layoutKey = Object.keys(this.props.layouts).filter(key=>(key === this.props.page.data.layout))[0];
        let fields = this.props.page.data.fields;
        return (
            <Dialog style={customContentStyle} title={fields.url?"Edit Page":"Add new Page"} actions={actions}
                    modal={true} open={true} autoDetectWindowHeight={true} autoScrollBodyContent={true}>
                <TextField onChange={e=>{this.props.pageFieldUpdate("title", e.target.value)}}
                           value={fields.title && fields.title.value||""} floatingLabelText="Title"/>
                <br/>
                <TextField onChange={e=>{this.props.pageFieldUpdate("url", e.target.value)}}
                           value={fields.url && fields.url.value||""} floatingLabelText="URL"/>
                <br/>
                <div style={{height: "72px", position: "relative"}}>
                    <label style={SelectLabelStyle}>Select Layout</label>
                    <select onChange={e=>{this.onLayoutChange(e.target.value)}} style={SelectStyle}>
                        <option value='empty' hidden>Select Layout</option>
                        {Object.keys(this.props.layouts).map(key =>
                            <option key={key} value={key}>{this.props.layouts[key].name}</option>)}
                    </select>
                </div>
                {Object.keys(fields).map(key=>this.renderNodes(fields[key], key))}
            </Dialog>
        );
    }
}
