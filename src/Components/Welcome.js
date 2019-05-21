import React from "react";
import { NavLink, HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";

export default class Welcome extends React.Component {
    render() {
        return (
            <div className="content-wrapper landing">
                <div>
                    <h1>Berlin Roulette</h1>
                </div>
                <HashRouter>
                    <div className="login">
                        <Route exact path="/" component={Registration} />
                        <Route path="/login" component={Login} />
                        <Route path="/register" component={Registration} />
                        <div className="nav justify-content-center w-100">
                            <NavLink
                                to="/login"
                                className="nav-item"
                                activeClassName="active"
                                activeStyle={{
                                    transform: "scale(1.05)",
                                    fontWeight: "bold",
                                    color: "black"
                                }}
                            >
                                <h3 className="special">Log-in</h3>
                            </NavLink>
                            <NavLink
                                to="/register"
                                className="nav-item"
                                activeClassName="active"
                                activeStyle={{
                                    transform: "scale(1.05)",
                                    fontWeight: "bold",
                                    color: "black"
                                }}
                            >
                                <h3 className="special">Register</h3>
                            </NavLink>
                        </div>
                    </div>
                </HashRouter>
            </div>
        );
    }
}
