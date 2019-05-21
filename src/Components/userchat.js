import React from "react";
import ChatPopUp from "./chatpopup";
import { socket } from "../socket";

export default class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.handleChat = this.handleChat.bind(this);
        this.chatInput = React.createRef();
        this.state = { showUserChat: true };
    }

    handleChat(e) {
        console.log("handling user chat", this.chatInput.current.value);
        socket.emit("sendUserChat", {
            comment: this.chatInput.current.value,
            receiver: this.props.receiver
        });
        e.preventDefault();
        this.chatInput.current.value = "";
    }

    render() {
        if (!this.props.chat) {
            return null;
        }
        return (
            <div className="userChatPopUp">
                {this.state.showUserChat ? (
                    <div className="chatEntry">
                        <form onSubmit={this.handleChat}>
                            <input type="textarea" ref={this.chatInput} />
                        </form>
                        <div>
                            <img
                                src="/minimize.png"
                                onClick={() =>
                                    this.setState({ showUserChat: false })
                                }
                            />
                        </div>
                    </div>
                ) : (
                    <div className="chatEntry">
                        <div>Test Test</div>
                    </div>
                )}
                {this.state.showUserChat && (
                    <ChatPopUp comments={this.props.chat} />
                )}
            </div>
        );
    }
}
