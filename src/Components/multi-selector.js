import React, { Component } from "react";
import MultiSelect from "@kenshooui/react-multi-select";

export default class Select extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            items: this.props.items,
            selectedItems: []
        };
    }

    handleChange(selectedItems) {
        this.setState({ selectedItems });
        this.props.handleSelect(selectedItems);
    }
    render() {
        const { items, selectedItems } = this.state;
        return (
            <MultiSelect
                items={items}
                selectedItems={selectedItems}
                onChange={this.handleChange}
            />
        );
    }
}
