import React, {Component} from "react";
import ReactDOM from "react-dom";

const formStyle = {
    background: "#fff"
};

const tabsStyle = {
    display: "flex"
};

const tabStyle = {
    outline: "1px solid gray",
    flex: "1 0 auto"
};


class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: null,
            currentItem: {}
        };
    }

    buildList() {
        var that = this;
        return (
            <div>
                <div onClick={()=>{that.setState({index: -1})}}>Add new item</div>
                {this.props.data.items.map((item, index) =>
                    <div><span> item-{index}</span> <span
                        onClick={()=>{that.setCurrentPiece.call(that, index)}}>Edit</span></div>
                )}
            </div>
        )
        //const {text, href} = this.props.data.items[this.state.index];
        //return (
        //    <div>
        //        <input value={text} onChange={e=>this.change("text", e.target.value)}/>
        //        <input value={href}/>
        //    </div>
        //)
    }

    setCurrentPiece(index) {
        this.setState({index: index})
    }

    buildForm() {
        var that = this;
        return (
            <div>
                {this.props.data.schema.item.fields.map((item, index) =>
                    that.buildFormElement(item, index)
                )}
                <div>
                    <span onClick={()=>this.setState({index: null})}>Cancel</span>
                    <span onClick={this.savePiece.bind(this)}>Save</span>
                </div>
            </div>
        )
    }

    savePiece() {
        let data = this.props.data;
        for (var key in this.state.currentItem){
            data.items[this.state.index][key] = this.state.currentItem[key]
        }
        this.props.updatePiece(this.props.id, {data: data});
        this.props.savePiece(this.props.id);
        this.setState({index: null,currentItem: {}});
    }

    buildFormElement(element, index) {
        let newItem = this.state.index === -1;
        let value = (!newItem && this.props.data.items[this.state.index][element.name]) ? this.props.data.items[this.state.index][element.name] : "";
        let label = element.title || element.label ?
            <label for={element.name}>{element.title || element.label}</label> : null;
        switch (element.type) {
            case "input":
            case undefined:
                return (
                    <div>{label}<input name={element.name} defaultValue={value} placeholder={element.placeholder}
                                       onBlur={e=>this.state.currentItem[element.name]=e.target.value}/></div>
                )
            case "select":
                return (
                    <div>
                        {label}
                        <select onChange={e=>this.state.currentItem[element.name]=e.target.value} defaultValue={value}>
                            <option value='empty' hidden>Select Layout</option>
                            {Object.keys(element.options).map(key =>
                                <option key={key} value={key}>{element.options[key]}</option>)}
                        </select>
                    </div>
                )
        }
    }

    render() {
        var innerElement = null;
        if (this.state.index === null) {
            innerElement = this.buildList();
        } else {
            innerElement = this.buildForm();
        }
        return (
            <div style={formStyle}>
                {innerElement}
            </div>
        )
    }
}

class MultipleElement extends Component {
    constructor(props) {
        super(props);
        //Math.random().toString(36).substr(16)
        this.mountEditMenu();
    }

    componentWillReceiveProps(nextProps) {
        // if (nextProps.edit) this.mountForm();
    }

    mountEditMenu() {
        let edit = document.createElement("BUTTON");
        edit.textContent = "Edit";
        const rect = this.props.node.getBoundingClientRect();
        edit.style.position = "fixed";
        edit.style.top = rect.top + "px";
        edit.style.right = rect.right - rect.width + "px";

        document.body.appendChild(edit);

        this._mountForm = this.mountForm.bind(this);
        edit.addEventListener("click", this._mountForm);
    }

    buildTabs() {
        return this.props.data.items.map((item, i) =>
            <div style={tabStyle}>{item.title || item.name || item.text || item.id}</div>);
    }

    mountForm() {
        this.formPanel = document.createElement("DIV");
        var ItemForm = null;
        ReactDOM.render(
            <Form data={this.props.data} savePiece={this.props.savePiece} updatePiece={this.props.updatePiece}
                  id={this.props.id}/>,
            this.formPanel);
        const rect = this.props.node.getBoundingClientRect();
        this.formPanel.style.position = "fixed";
        this.formPanel.style.top = rect.top + rect.height + "px";
        this.formPanel.style.left = rect.left + "px";
        document.body.appendChild(this.formPanel);
    }

    change() {
        debugger;
    }


}

MultipleElement.options = {
    validateDebounce: 500,
    validateOn: "change" || "save",
    validatePreventSave: true
};


///////////////////////////

const Item = props => <a href={props.item.href} className="js-anchor">{props.item.text}</a>;

//React.createElement(el)
const el = [
    //element
    "a",//can be html element or react component

    //attributes
    {
        href: "#asdf",
        "data-anyattr": "ertyuio"
    },

    //children
    "This is a text, but can be any children: html element or react component"
];

class Menu extends MultipleElement {

    formJSON() {
        return [
            {
                type: "email",//input[type], checkbox, radio, select, textarea, html-editor, source-editor
                label: "Text",
                name: "text",
                options: []//for select
            },
            {
                type: "checkbox",
                label: "Is featured",
                name: "featured"
            },
            {
                label: "Color",
                direction: "row",//for flex-direction: row | row-reverse | column | column-reverse
                styles: {},
                group: [//or group
                    {
                        type: "radio",
                        name: "color",
                        label: "Red",
                        value: "red"
                    },
                    {
                        type: "radio",
                        name: "color",
                        label: "Blue",
                        value: "blue"
                    }
                ]
            },
            {
                label: "User",
                direction: "row",
                group: [
                    {
                        // label: "",//optional
                        name: "firstName",
                        placeholder: "First Name"
                    },
                    {
                        name: "lastName",
                        placeholder: "Last Name"
                    }
                ]
            }
        ];
    }


    render() {
        return (
            <nav>
                {this.props.data.items.map(item => <Item item={item}/>)}
            </nav>
        )
    }
}

module.exports = Menu;