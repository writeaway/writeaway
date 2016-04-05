import React, {Component} from "react"
import IconButton from 'material-ui/lib/icon-button'
// import ActionVisibility from 'material-ui/lib/svg-icons/action/visibility'
// import ActionVisibilityOff from 'material-ui/lib/svg-icons/action/visibility-off'
import ActionFindInPage from 'material-ui/lib/svg-icons/action/find-in-page'
// import ActionCode from 'material-ui/lib/svg-icons/action/code'

class I18NList extends Component {
    render() {
        const height = 20;
        const listStyle = {maxHeight: '400px', overflow: 'auto'};
        const buttonStyle = {float: 'right', width: 20, height: height, padding: 1};//note float right changes order
        const iconStyle = {width: height - 2, height: height - 2};

        const {edit, data, elements, updateI18NData} = this.props;

        return (
            <div style={listStyle}>
                {
                    Object.keys(data).map(id => {
                        const element = elements[id];
                        const translate = data[id];
                        return (
                            <div key={id} style={{padding: '2px 0'}}>
                                <span style={{display: 'inline-block', height: height}}>{id}</span>
                                {(()=>{
                                    if (edit) {
                                        return <span style={{float: "right"}}>
                                                <input type="text" value={translate}
                                                       onChange={(e)=>updateI18NData(id, e.target.value)}/>
                                                <IconButton style={buttonStyle} iconStyle={iconStyle}
                                                            tooltipPosition="top-left" tooltip="Scroll to element"
                                                            onClick={()=>element.nodes[0].scrollIntoView()}><ActionFindInPage/>
                                                </IconButton>
                                            </span>
                                    } else {
                                        return <span style={{float: "right", color: "gray", fontSize: "0.8em"}}>{translate}</span>;
                                    }
                                })()}
                            </div>
                        )
                    })
                }
            </div>
        );
    }
}
export default I18NList
