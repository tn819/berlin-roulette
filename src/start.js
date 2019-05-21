import React from "react";
import ReactDOM from "react-dom";

//components
import Welcome from "./components/welcome";
import App from "./components/app";

//styling
import "bootstrap/dist/css/bootstrap.min.css";
import "@kenshooui/react-multi-select/dist/style.css";

import "normalize.css";
import "./styles/styles.css";

//redux, socket
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import reducer from "./reducer";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { init } from "./socket";

let elem;
const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);
console.log("getting store state", store.getState());

//consider before Mount here
if (location.pathname == "/welcome") {
    elem = <Welcome />;
} else {
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
    init(store);
}

ReactDOM.render(elem, document.querySelector("main"));
