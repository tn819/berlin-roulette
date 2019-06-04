import React from "react";

const Card = props => (
    <div className="col-md-6">
        <div className="card border mx-auto" style={{ width: "12rem" }}>
            <img
                className="card-img-top"
                src={props.pic}
                alt="Card image cap"
            />
            <div className="card-body">
                <h5 className="card-title special">{props.firstname}</h5>
            </div>

            <ul className="list-group list-group-flush">
                <p className="list-group-item">
                    Only {props.distance} meters away!
                </p>
                <p className="list-group-item bg-success">
                    Likes: {props.likes.map(like => `${like} `)}
                </p>
                <p className="list-group-item bg-danger">
                    Dislikes: {props.dislikes.map(like => `${like} `)}
                </p>
            </ul>
        </div>
    </div>
);

export default Card;
