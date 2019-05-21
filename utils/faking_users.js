//const stationJSON = require("vbb-stations/full.json");
const db = require("./db");
const raccoon = require("raccoon");
const fs = require("fs");
const path = require("path");
const promisify = require("util").promisify;
const readFile = promisify(fs.readFile);

const optionsToLike = [
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
];
async function getStations() {
    return await readFile(
        path.join(__dirname, "../node_modules/vbb-stations/full.json")
    );
}
async function assignUserRandomStation(stations, user) {
    let randomStation = Math.ceil(Math.random() * stations.length);
    let { id, location } = stations[randomStation];

    const insert = await db.insertStationLocation(
        user.userid,
        id,
        location.latitude,
        location.longitude
    );
    return insert.rows;
}
exports.recordLikes = async (userid, likes) => {
    console.log("getting likes from server", likes);
    let simpleLike = likes.map(like => like.label);
    return await Promise.all(
        optionsToLike.map(option => {
            -1 !== simpleLike.indexOf(option.label)
                ? raccoon
                      .liked(userid, option.label, { updateRecs: false })
                      .then(results => ({
                          userid,
                          label: option.label,
                          results
                      }))
                : raccoon
                      .disliked(userid, option.label, {
                          updateRecs: false
                      })
                      .then(results => ({
                          userid,
                          label: option.label,
                          results
                      }));
        })
    ).catch(err => console.log(err));
};
exports.recordLikeOverlap = (likes, users) => {
    Option.keys(users).map(userKey => {
        -1 !== likes.indexOf(users[userKey]);
    });
};
exports.summarizeUserLikes = async users => {
    return await Promise.all(
        users.map(user =>
            raccoon.allLikedFor(user.userid).then(results => ({
                [user.userid]: results
            }))
        )
    );
};

exports.intersect = (a, b) => {
    var t;
    if (b.length > a.length) (t = b), (b = a), (a = t); // indexOf to loop over shorter
    return a.filter(function(e) {
        return b.indexOf(e) > -1;
    });
};

exports.calcDistance = (p1, p2) => {
    function rad(x) {
        return (x * Math.PI) / 180;
    }
    var radius = 6378137; // Earth’s mean radius in meter

    var dLat = rad(p2.lat - p1.lat);
    var dLong = rad(p2.lng - p1.lng);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1.lat)) *
            Math.cos(rad(p2.lat)) *
            Math.sin(dLong / 2) *
            Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = radius * c;
    return d; // returns the distance in meter
};

// exports.calcDistance = (lat1, lon1, lat2, lon2) => {
//     var radlat1 = (Math.PI * lat1) / 180;
//     var radlat2 = (Math.PI * lat2) / 180;
//     var radlon1 = (Math.PI * lon1) / 180;
//     var radlon2 = (Math.PI * lon2) / 180;
//     var theta = lon1 - lon2;
//     var radtheta = (Math.PI * theta) / 180;
//     var dist =
//         Math.sin(radlat1) * Math.sin(radlat2) +
//         Math.cos(radlon1) * Math.cos(radlon2) * Math.cos(radtheta);
//     dist = Math.acos(dist);
//     dist = (dist * 180) / Math.PI;
//     dist = dist * 60 * 1.1515;
//     return dist * 1.609344;
// };

exports.sortUsers = async (latitude, longitude, users) => {
    return await users.sort((a, b) => {
        return a.longitude - longitude;
    });
};

exports.summarizeUserDislikes = async users => {
    return await Promise.all(
        users.map(user =>
            raccoon.allDislikedFor(user.userid).then(results => ({
                [user.userid]: results
            }))
        )
    );
};
exports.summarizeLikes = async () => {
    return await Promise.all(
        optionsToLike.map(option =>
            raccoon.likedCount(option.label).then(results => ({
                [option.label + "_liked"]: results
            }))
        )
    );
};

exports.summarizeDislikes = async () => {
    return await Promise.all(
        optionsToLike.map(option =>
            raccoon.dislikedCount(option.label).then(results => ({
                [option.label + "_disliked"]: results
            }))
        )
    );
};

exports.randomizeUserStops = async users => {
    let stations;
    try {
        let data = await getStations();
        stations = Object.values(JSON.parse(data));
        let berlinStations = stations.reduce((result, station) => {
            if (
                station.location.latitude <= 52.570528 &&
                station.location.latitude >= 52.419965 &&
                station.location.longitude <= 13.550173 &&
                station.location.longitude >= 13.320885
            ) {
                result.push(station);
            }
            return result;
        }, []);
        return await Promise.all(
            users.map(user => assignUserRandomStation(berlinStations, user))
        );
    } catch (e) {
        console.log(e);
    }
};

exports.randomizeUserLikes = async users => {
    try {
        return await Promise.all(
            users.map(({ userid }) => {
                return Promise.all(
                    optionsToLike.map(({ label }) => {
                        Math.random() < 0.5
                            ? raccoon
                                  .liked(userid, label, { updateRecs: false })
                                  .then(results => ({
                                      userid,
                                      label,
                                      results
                                  }))
                                  .catch(err => console.log(err))
                            : raccoon
                                  .disliked(userid, label, {
                                      updateRecs: false
                                  })
                                  .then(results => ({
                                      userid,
                                      label,
                                      results
                                  }))
                                  .catch(err =>
                                      console.log(userid, label, err)
                                  );
                    })
                );
            })
        );
    } catch (e) {
        console.log(e);
    }
};
