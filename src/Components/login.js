import React from "react";
import axios from "../../utils/axios";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ displayErrors: false });
        const form = {
            email: this.state.email,
            password: this.state.password
        };
        axios
            .post("/login", form)
            .then(({ data }) => {
                if (data.success) {
                    location.replace("/");
                } else {
                    this.setState({ displayErrors: true });
                }
            })
            .catch(() => this.setState({ displayErrors: true }));
    }
    //for CSS later .displayErrors input:invalid

    render() {
        const { displayErrors } = this.state;
        return (
            <div>
                <h2 className="special">Log In</h2>
                <form
                    onSubmit={this.handleSubmit}
                    noValidate
                    className={displayErrors ? "displayErrors" : ""}
                >
                    <label>
                        Email:
                        <br />
                        <input
                            type="email"
                            name="email"
                            onChange={this.handleChange}
                            required
                        />
                        <br />
                    </label>
                    <label>
                        Password (6-12 characters):
                        <br />
                        <input
                            type="password"
                            name="password"
                            pattern="^.{6,12}$"
                            onChange={this.handleChange}
                            required
                        />
                        <br />
                    </label>
                    <div className="d-flex justify-content-center m-2">
                        <button className="btn-l" type="submit">
                            Submit
                        </button>
                    </div>
                    {displayErrors && (
                        <div>
                            <p>Invalid Login</p>
                        </div>
                    )}
                </form>
            </div>
        );
    }
}
