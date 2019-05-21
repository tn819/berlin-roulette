import React from "react";
import FriendButton from "./friendbutton";
import { Link } from "react-router-dom";
import { socket } from "../socket";

const FriendCard = props => (
    <div className="friend-card-wrapper">
        {props.friends.map(friend => (
            <div className="friend-card" key={friend.id}>
                <div className="profile-pic-wrapper">
                    <Link to={`/user/${friend.id}`}>
                        <img src={friend.pic} />
                    </Link>
                </div>
                <div className="friend-card-details">
                    <FriendButton profileid={friend.id} />

                    <h4>{`${friend.firstname} ${friend.lastname}`}</h4>
                    <button
                        onClick={e => {
                            e.preventDefault();
                            socket.emit("getUserChat", friend.id);
                        }}
                    >
                        Chat
                    </button>
                </div>
            </div>
        ))}
    </div>
);

export default FriendCard;
