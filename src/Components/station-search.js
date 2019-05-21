import React from "react";
import Map from "./map";
import MultiSelect from "./multi-selector";
import WeeklyPicker from "./week-picker";
import axios from "../../utils/axios";
import { Redirect } from "react-router-dom";
import {
    changeStation,
    updateUser,
    updateUserDate,
    syncUserDetails
} from "../action";
import { connect } from "react-redux";

const Results = props => (
    <li className="list-group col-xs-6 search">
        {props.results.length > 0 ? (
            props.results.map(item => (
                <ul
                    className="list-group-item list-group-item-action"
                    key={item[0].id}
                    onClick={e => {
                        e.preventDefault();
                        props.handleClick(item[0].id);
                    }}
                >
                    {item[0].name}
                </ul>
            ))
        ) : (
            <p>No Results, Search Again</p>
        )}
    </li>
);

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.getStations = this.getStations.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleStation = this.handleStation.bind(this);
        this.postPic = this.postPic.bind(this);
        this.onFileAdded = this.onFileAdded.bind(this);
        this.search = React.createRef();
        this.handleDate = this.handleDate.bind(this);
        this.state = {
            query: "",
            results: [],
            typing: false,
            fileName: "",
            typingTimeout: 0,
            toggleStation: false,
            toggleInterest: true,
            togglePic: false,
            preferences: [],
            dates: [],
            pic: null,
            station: null
        };
    }
    componentDidMount() {
        axios
            .get("/userdetails")
            .then(({ data: user }) => {
                console.log("getting user", user);
                if (user.pic) {
                    this.setState({ pic: user.pic, togglePic: true });
                }
            })
            .catch(err => console.log("get user error", err));
    }
    updateUser() {
        this.props.dispatch(syncUserDetails(this.state.preferences));
    }

    handleDate(date) {
        this.setState({
            dates: date
        });
    }
    getStations() {
        axios
            .get(`/station/${this.state.query}`)
            .then(({ data }) => {
                console.log("station search results", data);
                this.setState({ results: data });
            })
            .catch(err => {
                console.log(err);
            });
    }
    async onFileAdded(e) {
        const file = e.target.files[0];
        await this.setState({
            file: file
        });
        this.postPic();
    }
    async postPic() {
        this.setState({ displayErrors: false });
        const form = new FormData();
        await form.append("file", this.state.file);
        console.log("posting pic", form);
        axios
            .post("/pic", form)
            .then(({ data }) => {
                if (data.pic) {
                    this.props.dispatch(updateUser({ pic: data.pic }));
                    this.setState({ togglePic: true, pic: data.pic });
                }
            })
            .catch(() => this.setState({ displayErrors: true }));
    }
    handleStation(id) {
        let selectedStation = this.state.results.filter(
            result => result[0].id == id
        );
        console.log("update location function", selectedStation[0]);
        this.props.dispatch(changeStation(selectedStation[0]));
        axios
            .post(`/location/`, selectedStation[0])
            .then(({ data }) => {
                console.log("in location update", data, this.state);

                return this.setState({
                    results: [],
                    station: selectedStation[0]
                });
            })
            .then(() => {
                this.setState({
                    toggleStation: true
                });
            })
            .catch(err => console.log(err));
    }

    handleInputChange() {
        const self = this;

        if (self.state.typingTimeout) {
            clearTimeout(self.state.typingTimeout);
        }
        this.setState({
            query: self.search.value,
            typing: false,
            typingTimeout: setTimeout(function() {
                self.getStations();
            }, 500)
        });
    }

    render() {
        const { isFilledOut } = this.props;
        if (isFilledOut) {
            return <Redirect to="/match" />;
        }
        let stationSelected = this.props.station;
        let selectedStation = null;
        selectedStation = stationSelected ? (
            <span>{stationSelected.name}</span>
        ) : (
            <span>{this.state.query}</span>
        );
        const { fileName } = this.state;
        let file = null;

        file = fileName ? (
            <span>File Selected - {fileName}</span>
        ) : (
            <span>Choose a file...</span>
        );

        return (
            <div className="container-fluid col-md-10 d-flex flex-column align-items-center">
                <div className="d-flex p-2">
                    <h1 className="col-md-8 special">About you</h1>

                    {this.state.togglePic ? (
                        <div className="card col-s-6 col-l-4 p-2">
                            <img
                                className="card-img-top rounded-circle"
                                src={this.state.pic}
                                alt="Card image"
                            />
                            <div className="card-body">
                                <h2 className="card-text special">
                                    Looking good{" "}
                                    {this.props.user
                                        ? this.props.user.firstname
                                        : null}
                                    !
                                </h2>
                            </div>
                        </div>
                    ) : null}
                </div>

                <div className="w-100">
                    <div className="form-group rounded">
                        <h3 className="special">Upload a pic</h3>
                        <div className="input-group mb-3">
                            <div className="custom-file">
                                <input
                                    type="file"
                                    className="custom-file-input"
                                    id="pic"
                                    onChange={this.onFileAdded}
                                />
                                <label
                                    className="custom-file-label"
                                    htmlFor="pic"
                                >
                                    {file}
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="form-group rounded">
                        <h3 className="special">U-bahn stop</h3>
                        {this.state.toggleStation && selectedStation ? (
                            <div
                                className="form-control"
                                onClick={e => {
                                    e.preventDefault();
                                    this.setState({
                                        toggleStation: !this.state.toggleStation
                                    });
                                }}
                            >
                                {selectedStation}
                            </div>
                        ) : (
                            <input
                                placeholder={"type in a station!"}
                                ref={input => (this.search = input)}
                                onChange={this.handleInputChange}
                                className="form-control"
                                id="station"
                            />
                        )}
                    </div>

                    {this.state.results.length == 0 ||
                    this.search.value == null ? null : (
                        <div className="form-group rounded">
                            <Results
                                results={this.state.results}
                                handleClick={id => this.handleStation(id)}
                            />
                        </div>
                    )}
                    {this.state.toggleStation &&
                    this.state.station !== undefined ? (
                        <div className="form-group rounded d-flex justify-content-center">
                            <Map
                                className="form-control"
                                icon={this.state.pic || "/roulette.png"}
                                station={this.state.station}
                            />
                        </div>
                    ) : null}
                    {this.state.toggleInterest ? (
                        <div className="form-group bg-light p-2 rounded">
                            <h2 className="special">What do you want to do?</h2>
                            <div className="form-group">
                                <MultiSelect
                                    className="form-control"
                                    id="interests"
                                    items={[
                                        { id: 0, label: "food" },
                                        { id: 2, label: "drink" },
                                        { id: 3, label: "nature" },
                                        { id: 4, label: "art" },
                                        { id: 5, label: "clubbing" },
                                        { id: 6, label: "surprises" },
                                        { id: 7, label: "walks" },
                                        { id: 8, label: "tv" },
                                        { id: 9, label: "sports" },
                                        { id: 10, label: "yoga" }
                                    ]}
                                    handleSelect={preferences =>
                                        this.setState({
                                            preferences: preferences
                                        })
                                    }
                                />
                            </div>
                        </div>
                    ) : null}
                    <div className="form-group rounded bg-light p-2">
                        <h3 className="special">Pick some dates</h3>
                        <WeeklyPicker
                            daysSelected={days => {
                                this.props.dispatch(updateUserDate({ days }));
                            }}
                        />
                    </div>
                    <div className="input-group rounded p-3 col-m-5">
                        <button
                            className="w-5 btn-lg btn-warning btn-block special border border-warning"
                            onClick={e => {
                                e.preventDefault();
                                if (
                                    this.state.preferences.length > 0 &&
                                    this.props.station !== undefined
                                )
                                    this.updateUser();
                                else {
                                    alert(
                                        "please submit station or preferences!"
                                    );
                                }
                            }}
                            type="button"
                        >
                            Go!
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    console.log("mapStateToProps", state);
    return {
        station: state.station,
        user: null,
        isFilledOut: state.isFilledOut
    };
};

export default connect(mapStateToProps)(Search);
