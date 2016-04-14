import React, {Component} from "react"

class I18NList extends Component {
    render() {
        const {edit, data, elements, updateI18NData} = this.props;

        return (
            <div className="i18n-list">
                {
                    Object.keys(data).map(id => {
                        const element = elements[id];
                        const translate = data[id];
                        return (
                            <div key={id} className="i18n-row">
                                <span className="i18n-item-id">{id}</span>
                                {(()=>{
                                    if (edit) {
                                        return <span className="input-wrapper">
                                                <input type="text" value={translate}
                                                       onChange={(e)=>updateI18NData(id, e.target.value)}/>
                                                <div className="icon-button" title="Scroll to element"
                                                            onClick={()=>element.nodes[0].scrollIntoView()}>
                                                    <i className="material-icons">find_in_page</i>
                                                </div>
                                            </span>
                                    } else {
                                        return <span className="i18n-item-value-disabled">{translate}</span>;
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
