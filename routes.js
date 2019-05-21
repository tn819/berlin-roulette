const express = require("express");
const app = express();
const register = require("./utils/register");
const s3 = require("./utils/s3");
const multer = require("multer");
const uidSafe = require("uid-safe");
const db = require("./utils/db");
const path = require("path");
const vbbAutocomplete = require("vbb-stations-autocomplete");
const stations = require("vbb-stations");
const randomize = require("./utils/faking_users");
const raccoon = require("raccoon");
const geolib = require("geolib");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, path.join(__dirname, "uploads"));
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});
const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

const isLoggedIn = (req, res, next) => {
    if (req.session.userid) {
        return next();
    } else {
        res.redirect("403");
    }
};

//ROUTES
app.post("/register", (req, res) => {
    register
        .checkValidRegistration(
            req.body.firstname,
            req.body.lastname,
            req.body.email,
            req.body.password
        )
        .then(inputs => {
            console.log("registration inputs:", inputs);
            return db.addUser(
                inputs.firstname,
                inputs.lastname,
                inputs.email,
                inputs.password
            );
        })
        .then(result => {
            console.log("db registration inputs:", result);

            Object.assign(req.session, result.rows[0]);
            res.json({ success: true });
        })
        .catch(err => {
            console.log("bad registration", err);
            res.json({ success: false });
        });
});

app.post("/login", (req, res) => {
    console.log("POST login route");
    db.getUserByEmail(req.body.email)
        .then(result => {
            console.log("initial get user", result.rows[0]);

            const {
                userid,
                email,
                firstname,
                lastname,
                pic,
                bio,
                station,
                latitude,
                longitude
            } = result.rows[0];
            Object.assign(req.session, {
                userid,
                email,
                firstname,
                lastname,
                pic,
                bio,
                station,
                latitude,
                longitude
            });
            console.log("initial login cookies", req.session);
            return db.checkPassword(req.body.password, result.rows[0].password);
        })
        .then(result => {
            console.log("successful login", result);
            if (result) {
                res.json({ success: true });
            }
            res.json({ success: false });
        })
        .catch(err => {
            console.log("bad login", err);
            req.session.userid = null;
            res.json({ success: false });
        });
});

app.post("/pic", isLoggedIn, uploader.single("file"), s3.upload, (req, res) => {
    console.log(process.env.s3Url);
    const url = process.env.s3Url + req.file.filename;
    db.updateUserPic(req.session.userid, url)
        .then(results => {
            const { rows } = results;
            console.log("update pic", rows);
            res.json(rows[0]);
        })
        .catch(err => {
            console.log(err);
            res.json({ success: false });
        });
});

app.post("/bio", isLoggedIn, (req, res) => {
    db.updateUserBio(req.session.userid, req.body.bio)
        .then(results => {
            const { rows } = results;
            console.log("update bio", rows);
            res.json(rows[0]);
        })
        .catch(err => {
            res.json({ success: false });
            console.log(err);
        });
});

app.get("/randomizeAll", isLoggedIn, async (req, res) => {
    console.log("in random users route");
    let { rows: users } = await db.getAllUsers();
    //
    let userLikes = await randomize.summarizeUserLikes(users);
    let userDislikes = await randomize.summarizeUserDislikes(users);
    let user5Users = await raccoon.mostSimilarUsers(5);
    // let user5Likes = await raccoon.allLikedFor(5);
    // let topRate = await raccoon.bestRated();
    // let bottomRate = await raccoon.worstRated();
    // let mostLike = await raccoon.mostLiked();
    // let mostDislike = await raccoon.mostDisliked();
    // let likeSummary = await randomize.summarizeLikes();
    // let dislikeSummary = await randomize.summarizeDislikes();
    res.json({
        userLikes: userLikes,
        userDislikes: userDislikes,
        user5Users: user5Users
        //     user: user5Users,
        //     topRate: topRate,
        //     bottomRate: bottomRate,
        //     mostLike: mostLike,
        //     mostDislike: mostDislike,
        //     user5Likes: user5Likes,
        //     likeSummary: likeSummary,
        //     dislikeSummary: dislikeSummary
    });
    // await raccoon.stat.mostSimilarUsers(10).then(simUsers => {
    //     let replyObj = { simUsers: simUsers };
    //     res.send(replyObj);
    // });
    //let currentResult = await randomize.summarizeLikes();
});

app.post("/likes", isLoggedIn, async (req, res) => {
    console.log(req.body);
    let userLikes = await raccoon.allLikedFor(req.session.userid);
    let userDislikes = await raccoon.allDislikedFor(req.session.userid);
    console.log(userLikes, userDislikes);
    return res.json({ userLikes: userLikes, userDislikes: userDislikes });
    // randomize
    //     .recordLikes(req.session.userid, req.body)
    //     .then(async () => {
    //         let userLikes = await raccoon.allLikedFor(req.session.userid);
    //         let userDislikes = await raccoon.allDislikedFor(req.session.userid);
    //         return res.json({ userLikes, userDislikes });
    //     })
    //     .catch(err => console.log(err));
});

app.get("/api/match", isLoggedIn, async (req, res) => {
    try {
        var { rows: user } = await db.getUserById(req.session.userid);
        user = user[0];
        let { rows: users } = await db.getAllUsers();
        let usersDistanceFeatures = users.map(randomUser => {
            let ulat = parseFloat(user.latitude);
            let ulong = parseFloat(user.longitude);
            let glat = parseFloat(randomUser.latitude);
            let glong = parseFloat(randomUser.longitude);

            let distance = randomize.calcDistance(
                {
                    lat: ulat,
                    lng: ulong
                },
                {
                    lat: glat,
                    lng: glong
                }
            );
            return {
                ...randomUser,
                distance: distance
            };
        });
        users = await usersDistanceFeatures.sort(
            (a, b) => a.distance - b.distance
        );
        let sortedDistanceUsers = users.slice(0, 100);
        let userLikes = await randomize.summarizeUserLikes(sortedDistanceUsers);
        let userDislikes = await randomize.summarizeUserDislikes(
            sortedDistanceUsers
        );
        console.log(Object.keys(userLikes[9]), Object.keys(userDislikes[9]));
        let userDistanceLikeResults = await sortedDistanceUsers.map(
            sortedDistanceUser => {
                try {
                    let likes = userLikes.filter(userLikesObject => {
                        return (
                            Number(Object.keys(userLikesObject)[0]) ==
                            Number(sortedDistanceUser.userid)
                        );
                    })[0];
                    let dislikes = userDislikes.filter(userDislikesObject => {
                        return (
                            Number(Object.keys(userDislikesObject)[0]) ==
                            Number(sortedDistanceUser.userid)
                        );
                    })[0];
                    console.log({
                        ...sortedDistanceUser,
                        likes: Object.values(likes)[0],
                        dislikes: Object.values(dislikes)[0]
                    });
                    return {
                        ...sortedDistanceUser,
                        likes: Object.values(likes)[0],
                        dislikes: Object.values(dislikes)[0]
                    };
                } catch (err) {
                    console.log(err);
                }
            }
        );
        let currentUser = userDistanceLikeResults.filter(
            user => req.session.userid == user.userid
        )[0];
        let allOtherUsers = userDistanceLikeResults.filter(
            user => req.session.userid != user.userid
        );
        let userLikeOverlapResults = allOtherUsers.map(randomUser => {
            let likeOverlap = randomize.intersect(
                randomUser.likes,
                currentUser.likes
            );
            let dislikeOverlap = randomize.intersect(
                randomUser.dislikes,
                currentUser.dislikes
            );
            let userLikeOverlap = likeOverlap.length + dislikeOverlap.length;
            console.log("likeoverlap", userLikeOverlap);
            return {
                ...randomUser,
                likeOverlap: likeOverlap,
                dislikeOverlap: dislikeOverlap,
                userLikeOverlap: userLikeOverlap
            };
        });
        let userResults = await userLikeOverlapResults.sort(
            (a, b) => b.userLikeOverlap - a.userLikeOverlap
        );
        let finalGroupSet = userResults.slice(0, 4);
        let groupInsert = finalGroupSet.map(user => user.userid);
        let { rows: newGroup } = await db.createGroup([
            ...groupInsert,
            currentUser.userid
        ]);
        console.log(newGroup);
        res.json({ finalGroupSet, newGroup });
    } catch (err) {
        console.log(err);
    }
});

app.post("/availability", isLoggedIn, (req, res) => {
    console.log("getting dates", req.body);
    db.updateUserAvailability(req.session.userid, req.body.days)
        .then(({ rows }) => {
            console.log(rows);
            res.json(rows[0]);
        })
        .catch(err => console.log(err));
});

app.post("/location", isLoggedIn, (req, res) => {
    console.log("in location route", req.body[0]);
    db.updateUserLocation(
        req.session.userid,
        req.body[0].id,
        req.body[0].location.latitude,
        req.body[0].location.longitude
    )
        .then(({ rows }) => {
            console.log(rows);
            res.json(rows[0]);
        })
        .catch(err => {
            res.json({ success: false });
            console.log(err);
        });
});

app.get("/user", isLoggedIn, (req, res) => {
    console.log("get user route");
    db.getUserById(req.session.userid)
        .then(({ rows }) => {
            console.log("initial get user", rows);
            res.json(rows[0]);
        })
        .catch(err => {
            res.json({ success: false });
            console.log(err);
        });
});
app.get("/userdetails", isLoggedIn, (req, res) => {
    db.getUserById(req.session.userid)
        .then(({ rows }) => {
            const {
                userid,
                firstname,
                lastname,
                email,
                pic,
                station,
                latitude,
                longitude,
                availability
            } = rows[0];
            res.json({
                userid,
                firstname,
                lastname,
                email,
                pic,
                station,
                latitude,
                longitude,
                availability
            });
        })
        .catch(err => {
            res.json({ success: false });
            console.log(err);
        });
});

app.get("/station/:search", isLoggedIn, (req, res) => {
    let results = vbbAutocomplete(req.params.search, 5, true).map(({ id }) =>
        stations(id)
    );
    res.json(results);
});

app.get("/search/:fragment", isLoggedIn, (req, res) => {
    console.log("search", req.params.fragment);
    db.getUserByFragment(req.params.fragment)
        .then(({ rows }) => {
            console.log("search results", rows);
            res.json(rows);
        })
        .catch(err => {
            console.log(err);
        });
});

app.get("/api/user/:id", isLoggedIn, (req, res) => {
    console.log("get non-logged in user route", req.params.id);
    db.getUserById(req.params.id)
        .then(({ rows }) => {
            if (rows[0].userid === req.session.userid) {
                res.json({ isLoggedInUser: true });
            } else {
                res.json(rows[0]);
            }
        })
        .catch(err => {
            res.json({ success: false });
            console.log(err);
        });
});

app.get("/friendship/:receiver", isLoggedIn, (req, res) => {
    console.log("friend request route", req.params);
    db.getFriendship(req.session.userid, req.params.receiver)
        .then(({ rows }) => {
            console.log(rows, "db response for friendship");
            res.json(rows[0]);
        })
        .catch(err => console.log(err));
});

app.post("/friendship/:id", isLoggedIn, (req, res) => {
    let { type } = req.body;
    console.log(req.body, req.params, "friendship adjustment");
    if (type === "accept") {
        db.updateFriendship(req.session.userid, req.params.id, true)
            .then(data => {
                console.log("accept friendship", data);
                res.json({
                    requestAccepted: true
                });
            })
            .catch(err => console.log(err));
    } else if (type === "add") {
        db.addFriendship(req.session.userid, req.params.id)
            .then(data => {
                console.log("add friendship", data);
                res.json({
                    requestSent: true,
                    requestSender: true
                });
            })
            .catch(err => console.log(err));
    } else if (type === "delete") {
        db.deleteFriendship(req.session.userid, req.params.id)
            .then(data => {
                console.log("delete friendship data", data);
                res.json({
                    requestSent: false,
                    requestAccepted: false,
                    requestSender: null
                });
            })
            .catch(err => console.log(err));
    }
});

app.get("/friendships", isLoggedIn, (req, res) => {
    console.log("in friendships route");
    db.getFriendships(req.session.userid)
        .then(({ rows }) => {
            console.log("gathering all friend", rows);
            res.json({
                id: req.session.userid,
                friends: rows
            });
        })
        .catch(err => console.log(err));
});

app.get("/welcome", (req, res) => {
    if (req.session.userid) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("/logout", (req, res) => {
    req.session = null;
    console.log("logout route!", req.session);
    res.redirect("/");
});

app.get("*", (req, res) => {
    if (!req.session.userid) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

module.exports = app;
