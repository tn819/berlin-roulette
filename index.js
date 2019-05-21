const express = require("express");
const app = express();
const server = require("http").Server(app);
//include heroku app url to ensure it also works when live (white space separation)

require("dotenv").config();
const db = require("./utils/db");
const path = require("path");

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) =>
        res.sendFile(path.join(__dirname, "bundle.js"))
    );
}

const cookieSession = require("cookie-session");
const cookieSessionMiddleware = cookieSession({
    maxAge: 1000 * 60 * 60 * 24 * 14,
    secret: process.env.secret
});
app.use(cookieSessionMiddleware);
app.use(require("./utils/config"));
app.use(require("./routes"));
//socket stuff

const io = require("socket.io")(server, {
    origins: "localhost:8080 fakesocialnetwork.heroku.com:*"
});

let onlineUsers = {};

io.use((socket, next) =>
    cookieSessionMiddleware(socket.request, socket.request.res, next)
);

io.on("connection", socket => {
    console.log(`socket with the id ${socket.id} is now connected`);
    if (!socket.request.session || !socket.request.session.userid) {
        return socket.disconnect(true);
    }
});

server.listen(8080, function() {
    console.log("I'm listening this is NODE.");
});
