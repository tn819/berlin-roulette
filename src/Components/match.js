import React from "react";
import Card from "./card";
import { getMatches } from "../action";
import { connect } from "react-redux";

class Progress extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toggleUser: true
        };
    }
    render() {
        return (
            <div>
                <div className="progress" styles={{ height: "20px" }}>
                    <div
                        className={`progress-bar w-${
                            this.props.progress
                        } bg-warning`}
                        role="progressbar"
                    />
                </div>
            </div>
        );
    }
}

class Match extends React.Component {
    constructor(props) {
        super(props);
        this.handleLoad = this.handleLoad.bind(this);
        this.tick = this.tick.bind(this);
        this.state = {
            progress: 0,
            toggleBar: false,
            toggleUsers: false
        };
    }

    handleLoad() {
        this.setState({
            toggleBar: true
        });
        this.intervalLog = setInterval(() => {
            this.tick();
        }, 1000);
    }
    async endLoad() {
        try {
            clearInterval(this.intervalLog);
            await this.props.dispatch(getMatches());
        } catch (e) {
            console.log("endload error", e);
        }
        this.setState({ toggleBar: false, toggleUsers: true });
    }
    tick() {
        this.setState(prevState => {
            if (prevState.progress < 100)
                return {
                    progress: prevState.progress + 25
                };
            this.endLoad();
        });
    }

    render() {
        let { progress } = this.state;
        let groupUsers = this.props.groupUsers;
        let usersGroup = null;
        usersGroup = this.props.groupUsers != undefined ? groupUsers : null;
        console.log("groupUsers", usersGroup);
        if (usersGroup != null) {
            return (
                <div className="mx-auto col-md-10 d-flex flex-column align-items-center">
                    <h1 className="special">Get matches!</h1>
                    <div className="p-3 w-100 d-flex flex-column align-items-center justify-content-between">
                        {this.state.toggleBar ? (
                            <div className="d-flex flex-column col-md-10 align-items-center justify-content-between p-2">
                                <div className="h-50">
                                    <div className="roulette-load yellow">
                                        <img
                                            className="roulette"
                                            src="roulette.png"
                                        />
                                    </div>
                                </div>
                                <Progress
                                    progress={progress}
                                    className="col-md-6 align-items-center w-100"
                                />
                            </div>
                        ) : null}
                        {!this.state.toggleUsers ? (
                            <div>
                                <button
                                    className="btn-lg btn-block special border border-warning"
                                    ref={btn => {
                                        this.btn = btn;
                                    }}
                                    onClick={e => {
                                        e.preventDefault();
                                        this.handleLoad();
                                    }}
                                >
                                    JUST PUSH IT!
                                </button>
                            </div>
                        ) : null}
                    </div>

                    <div className="row">
                        {usersGroup.map(user => (
                            <Card
                                pic={user.pic}
                                firstname={user.firstname}
                                likes={user.likes}
                                dislikes={user.dislikes}
                                distance={user.distance}
                            />
                        ))}
                    </div>
                </div>
            );
        } else {
            return (
                <div className="mx-auto col-md-10 d-flex flex-column align-items-center">
                    <h1 className="special">Get matches!</h1>
                    <div className="p-3 w-100 d-flex flex-column align-items-center justify-content-between">
                        {this.state.toggleBar ? (
                            <div className="d-flex flex-column col-md-10 align-items-center justify-content-between p-2">
                                <div className="h-50">
                                    <div className="roulette-load yellow">
                                        <img
                                            className="roulette"
                                            src="roulette.png"
                                        />
                                    </div>
                                </div>
                                <Progress
                                    progress={progress}
                                    className="col-md-6 align-items-center w-100"
                                />
                            </div>
                        ) : null}
                        {!this.state.toggleUsers ? (
                            <div>
                                <button
                                    className="btn-lg btn-block special border border-warning"
                                    ref={btn => {
                                        this.btn = btn;
                                    }}
                                    onClick={e => {
                                        e.preventDefault();
                                        this.handleLoad();
                                    }}
                                >
                                    JUST PUSH IT!
                                </button>
                            </div>
                        ) : null}
                    </div>
                </div>
            );
        }
    }
}

const mapStateToProps = state => {
    console.log("mapStateToProps", state);
    return {
        groupUsers: state.groupUsers,
        groupDetails: state.groupDetails
    };
};

export default connect(mapStateToProps)(Match);
