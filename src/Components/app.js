import React from "react";
import { BrowserRouter, Route, NavLink, Redirect } from "react-router-dom";
import axios from "../../utils/axios";
import Search from "./station-search";
import Match from "./match";
import { updateUser, getUser } from "../action";
import { connect } from "react-redux";

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.dispatch(getUser());
    }

    render() {
        return (
            <BrowserRouter>
                <div className="jumbotron-fluid h-100 justify-content-center align-items-center">
                    <nav className="navbar sticky-top navbar-expand-sm nav-pills nav-fill navbar-light bg-light justify-content-center">
                        <NavLink
                            className="navbar-brand"
                            activeClassName="active"
                            activeStyle={{
                                transform: "scale(1.2)",
                                fontWeight: "bold"
                            }}
                            to="/"
                        >
                            <div className="roulette-icon">
                                <img className="icon" src="/roulette.png" />
                            </div>
                        </NavLink>
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-toggle="collapse"
                            data-target="#navbarSupportedContent"
                            aria-controls="navbarSupportedContent"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon" />
                        </button>
                        <div className="collapse navbar-collapse">
                            <NavLink
                                className="nav-item"
                                activeClassName="active"
                                activeStyle={{
                                    transform: "scale(1.2)",
                                    fontWeight: "bold"
                                }}
                                to="/about"
                            >
                                <div className="nav-link">
                                    <img
                                        src="/open-iconic-master/png/person-6x.png"
                                        className="icon"
                                    />
                                </div>
                            </NavLink>
                            <NavLink
                                className="nav-item"
                                activeClassName="active"
                                activeStyle={{
                                    transform: "scale(1.2)",
                                    fontWeight: "bold"
                                }}
                                to="/match"
                            >
                                <div>
                                    <img
                                        src="/open-iconic-master/png/people-6x.png"
                                        className="icon"
                                    />
                                </div>
                            </NavLink>
                            <NavLink
                                className="nav-item"
                                activeClassName="active"
                                activeStyle={{
                                    transform: "scale(1.2)",
                                    fontWeight: "bold"
                                }}
                                to="/people"
                            >
                                <div>
                                    <img
                                        src="/open-iconic-master/png/beaker-6x.png"
                                        className="icon"
                                    />
                                </div>
                            </NavLink>
                            <NavLink
                                className="nav-item"
                                activeClassName="active"
                                activeStyle={{
                                    transform: "scale(1.2)",
                                    fontWeight: "bold"
                                }}
                                to="/chat"
                            >
                                <div>
                                    <img
                                        src="/open-iconic-master/png/chat-6x.png"
                                        className="icon"
                                    />
                                </div>
                            </NavLink>
                            <a className="nav-item" href="/logout">
                                <img
                                    src="/open-iconic-master/png/account-logout-6x.png"
                                    className="icon"
                                />
                            </a>
                        </div>
                    </nav>
                    <div className="content-wrapper">
                        <Route
                            exact
                            path="/"
                            render={() =>
                                this.props.isFilledOut ? (
                                    <Redirect to="/match" />
                                ) : (
                                    <Search />
                                )
                            }
                        />
                        <Route path="/about" render={() => <Search />} />
                        <Route path="/match" render={() => <Match />} />
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

const mapStateToProps = state => {
    console.log("mapStateToProps", state);
    return {
        station: state.station,
        isFilledOut: state.isFilledOut
    };
};

export default connect(mapStateToProps)(App);
