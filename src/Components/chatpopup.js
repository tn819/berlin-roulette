import React from "react";

export default class ChatPopUp extends React.Component {
    constructor(props) {
        super(props);
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }

    scrollToBottom(options) {
        this.messagesEnd.scrollIntoView(options);
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom({ behavior: "smooth" });
    }
    render() {
        return (
            <div className="chatDisplay">
                <div className="scrollingChat">
                    {this.props.comments.map((comment, index, comments) => (
                        <div className="chatLine" key={comment.messageid}>
                            <div className="chatComment">{comment.comment}</div>
                            {comments[index + 1] &&
                            comments[index + 1].id ==
                                comments[index].id ? null : (
                                <div className="chatPic">
                                    <div className="chatPic-wrapper">
                                        <img src={comment.pic} />
                                    </div>
                                    <div className="chatPic-commenter">
                                        <div>
                                            <strong>{`-${comment.firstname} ${
                                                comment.lastname[0]
                                            }.`}</strong>
                                        </div>
                                        <div>
                                            <em>{comment.formatted_time}</em>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    <div
                        ref={el => {
                            this.messagesEnd = el;
                        }}
                    />
                </div>
            </div>
        );
    }
}
