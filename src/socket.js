import * as io from "socket.io-client";
import {
    onlineUsers,
    userJoined,
    userLeft,
    receiveChat,
    receiveUserChat
} from "./action";

export let socket;

export function init(store) {
    if (!socket) {
        socket = io.connect();
        console.log(store);

        socket.on("onlineUsers", users => {
            store.dispatch(onlineUsers(users));
        });

        socket.on("userJoined", user => {
            console.log(user);
            store.dispatch(userJoined(user));
        });

        socket.on("userLeft", user => {
            store.dispatch(userLeft(user));
        });

        socket.on("chatHistory", history => {
            store.dispatch(receiveChat(history));
        });

        socket.on("userChatHistory", history => {
            store.dispatch(receiveUserChat(history));
        });
    }
}
