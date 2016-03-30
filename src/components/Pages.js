import React from 'react'
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';
import IconButton from 'material-ui/lib/icon-button';
import AddPage from 'material-ui/lib/svg-icons/action/note-add';

export default class Pages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {newPageActive: false};
        this.data = {};
    }


    onTextChange(value) {
        this.setState({text: value});
    }

    render() {
        const actions = [
                <FlatButton
                    label="Cancel"
                    secondary={true}
                    onClick={()=>{this.setState({newPageActive: false})}}
                />,
                <FlatButton
                    label="Submit"
                    primary={true}
                    onClick={()=>this.props.addPage&&this.props.addPage(this.data)}
                />,
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
            }
        return (
            <div>
                <IconButton onClick={()=>this.setState({newPageActive: true})}>
                    <AddPage/>
                </IconButton>
                <Dialog
                    style={customContentStyle}
                    title="Add new Page"
                    actions={actions}
                    modal={true}
                    open={this.state.newPageActive}
                    autoDetectWindowHeight={true}
                    autoScrollBodyContent={true}
                >

                    <TextField onChange={e=>this.data.title=e.target.value}
                               hintText="Enter page title Here"
                               floatingLabelText="Page Title"
                    /><br/>
                    <TextField onChange={e=>this.data.url=e.target.value}
                               hintText="Enter page url here"
                               floatingLabelText="Page URL"
                    /><br/>
                    <select onChange={e=>this.data.layout=e.target.value} style={SelectStyle}>
                        <option value="main">Main</option>
                        <option value="about">About</option>
                        <option value="partners">Partners</option>
                    </select>
                </Dialog>
            </div>
        );
    }
}
