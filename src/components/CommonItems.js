import React, {Component} from "react"

/**
 * NOT USED ANYWHERE
 */
class CommonItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            click: false,
            editIndex: -1
        };
        // console.log(props);
    }

    onChange(name, e) {
        var newData = this.props.data.items.slice();
        newData[this.state.editIndex][name] = e.target ? e.target.value : e;
        this.props.updatePiece(this.props.id, {data: {items: newData}});
    }

    onComponentClick(e) {
        var nev = e.nativeEvent;
        this.setState({click: true})
        setTimeout(() => {
            let editIndex = -1,
                el = document.elementFromPoint(nev.clientX, nev.clientY);
            this.items.some((item, i) => {
                const isEl = this.refs["item" + i] === el;
                if (isEl) editIndex = i
                return isEl
            });
            if (editIndex !== void 0) {
                this.setState({
                    click: false,
                    editIndex: editIndex
                })
            } else {
                this.setState({click: false})
            }
        }, 0);
    }

    onFormClose() {
        this.setState({editIndex: -1})
    }

    get items() {
        return this.props.data.items.map((item, i) => {
            item = {...item};
            if (this.props.edit) {
                item.className += " redaxtor-piece-item"
            }
            return this.getItem(item, i);
        })
    }
}
export default CommonItems