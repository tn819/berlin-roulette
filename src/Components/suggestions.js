import React from "react";
import { Link } from "react-router-dom";

const Suggestions = props => {
    if (!props.results) {
        return null;
    }
    const options = props.results.map(r => (
        <li key={r.id}>
            <Link to={`/user/${r.id}`}>{`${r.firstname} ${r.lastname}`}</Link>
        </li>
    ));
    return <ul>{!options ? <li>{"No results"}</li> : options}</ul>;
};

export default Suggestions;
