import React, {Component} from "react"

class I18NList extends Component {
    render() {
        const {edit, data, elements, updateI18NData} = this.props;

        return (
            <div className="items-list">
                {Object.keys(data).map(id => {
                    const element = elements[id];
                    const translate = data[id];
                    return (
                        <div key={id} className="item-row">
                            <span>{id}</span>
                            <span className="item-right">
                                {(()=> {
                                    if (edit) {
                                        return <span className="input-wrapper">
                                            <input type="text" value={translate}
                                                   onChange={(e)=>updateI18NData(id, e.target.value)}/>
                                        </span>
                                    } else {
                                        return <span className="item-value">{translate}</span>;
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
