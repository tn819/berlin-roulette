import React from "react";
import axios from "../../utils/axios";
import Modal from "react-modal";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.postPic = this.postPic.bind(this);
    }

    postPic() {
        this.setState({ displayErrors: false });
        const form = new FormData();
        form.append("file", document.getElementById("pic").files[0]);
        console.log("posting pic", form);
        axios
            .post("/pic", form)
            .then(({ data }) => {
                if (data.pic) {
                    this.props.updatePic(data.pic);
                }
            })
            .catch(() => this.setState({ displayErrors: true }));
    }

    //for CSS later .displayErrors input:invalid

    render() {
        const { displayErrors } = this.state;
        return (
            <Modal
                isOpen={this.props.showModal}
                contentLabel="Profile Pic Upload"
                onRequestClose={this.props.hideModal}
                ariaHideApp={false}
                className="modal"
            >
                <div>
                    <form
                        onSubmit={this.postPic}
                        noValidate
                        className={displayErrors ? "displayErrors" : ""}
                    >
                        <label>
                            Select a pic:
                            <input type="file" id="pic" accept="image/*" />
                        </label>

                        <button type="submit">Upload</button>
                        {displayErrors && (
                            <div>
                                <p>Form is not valid</p>
                            </div>
                        )}
                    </form>
                </div>
            </Modal>
        );
    }
}
