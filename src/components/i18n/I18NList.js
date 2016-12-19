import React, {Component} from "react"

class I18NList extends Component {
    render() {
        const {editorActive, data, elements, updateI18NData} = this.props;

        return (
            <div className="r_list">
                {Object.keys(data).map(id => {
                    const element = elements[id];
                    const translate = data[id];
                    return (
                        <div key={id} className="r_item-row">
                            <span>{id}</span>
                            <span className="r_item-right">
                                {(()=> {
                                    if (editorActive) {
                                        return <span className="r_input-wrapper">
                                            <input type="text" value={translate}
                                                   onChange={(e)=>updateI18NData(id, e.target.value)}/>
                                        </span>
                                    } else {
                                        return <span className="r_item-value">{translate}</span>;
                                    }
                                })()}
                            </span>
                        </div>
                    )
                })}
            </div>
        );
    }
}
export default I18NList
