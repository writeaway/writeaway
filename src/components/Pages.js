import React from 'react'
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';
import IconButton from 'material-ui/lib/icon-button';
import AddPage from 'material-ui/lib/svg-icons/action/note-add';

export default class Pages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {newPageActive: false, value: 2};
    }

    handleChange(event, index, value) {
        debugger;
        this.setState({value})
    };

    onTextChange(value) {
        this.setState({text: value});
    }

    render() {
        const actions = [
                <FlatButton
                    label="Cancel"
                    secondary={true}
                    onClick={()=>{console.log(this.state)}}
                />,
                <FlatButton
                    label="Submit"
                    primary={true}
                    onTouchTap={this.handleClose}
                />,
            ],
            customContentStyle = {
                width: '90%',
                maxWidth: 'none'
            };
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
                    autoDetectWindowHeight={true} autoScrollBodyContent={true}
                >

                    <TextField onChange={e=>this.setState({title:e.target.value})}
                               hintText="Enter page title Here"
                               floatingLabelText="Page Title"
                    />
                    <TextField onChange={e=>this.setState({url:e.target.value})}
                               hintText="Enter page url here"
                               floatingLabelText="Page URL"
                    /><br/>
                </Dialog>
            </div>
        );
    }
}
