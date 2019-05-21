import React from "react";
import axios from "../../utils/axios";
import Suggestions from "./suggestions";

export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: "",
            results: []
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.getUsers = this.getUsers.bind(this);
    }

    handleInputChange() {
        this.setState({
            query: this.search.value
        });
    }
    getUsers(e) {
        console.log(this.state.query);
        axios
            .get(`/search/${this.state.query}`)
            .then(({ data }) => {
                this.setState({ results: data });
                this.search.value = "";
            })
            .catch(err => {
                console.log(err);
            });

        e.preventDefault();
    }

    render() {
        return (
            <div>
                <form onSubmit={this.getUsers}>
                    <input
                        placeholder="Search for..."
                        ref={input => (this.search = input)}
                        onChange={this.handleInputChange}
                    />
                </form>
            </div>
            // {this.state.results && (
            //     <Suggestions results={this.state.results} />
            // )}
        );
    }
}
