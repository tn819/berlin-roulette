import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import axios from "../../utils/axios";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import OtherProfile from "./otherprofile";
import BioEditor from "./bioeditor";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showUpload: false
        };
        this.updatePic = this.updatePic.bind(this);
        this.showModal = this.showModal.bind(this);
        this.editBio = this.editBio.bind(this);
    }

    componentDidMount() {
        axios
            .get("/user")
            .then(({ data }) => {
                console.log("initial user get for app page", data);
                this.setState({
                    userid: data.userid,
                    email: data.email,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    bio: data.bio || null,
                    pic: data.pic || "/default.jpg"
                });
            })
            .catch(err => console.log(err));
    }

    showModal(e) {
        e.preventDefault();
        this.setState({
            showUpload: true
        });
    }

    editBio(newBio) {
        this.setState({
            bio: newBio
        });
    }

    updatePic(url) {
        this.setState({
            pic: url,
            showUpload: false
        });
    }

    render() {
        if (!this.state.userid) {
            <div>spinner</div>;
        }
        return (
            <BrowserRouter>
                <div>
                    <div className="app-menu">
                        <h1>App</h1>

                        <div className="app-menu-submenu">
                            <h3>
                                <a href="/logout">Log Out</a>
                            </h3>
                            <ProfilePic
                                pic={this.state.pic}
                                altname={`${this.state.firstname} ${
                                    this.state.lastname
                                }`}
                                showModal={this.showModal}
                                className="profile-pic"
                            />
                        </div>
                    </div>
                    {this.state.showUpload && (
                        <Uploader
                            updatePic={this.updatePic}
                            showModal={this.state.showUpload}
                            hideModal={() =>
                                this.setState({ showUpload: false })
                            }
                        />
                    )}
                    <div>
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    fullname={`${this.state.firstname} ${
                                        this.state.lastname
                                    }`}
                                    profilePic={
                                        <ProfilePic
                                            pic={this.state.pic}
                                            altname={`${this.state.firstname} ${
                                                this.state.lastname
                                            }`}
                                            showModal={this.showModal}
                                        />
                                    }
                                    bioEditor={
                                        <BioEditor
                                            bio={this.state.bio}
                                            editBio={this.editBio}
                                        />
                                    }
                                />
                            )}
                        />
                        <Route
                            path="/user/:id"
                            render={props => (
                                <OtherProfile
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}