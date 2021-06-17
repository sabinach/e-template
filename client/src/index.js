import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./styles/index.css";
import TimeAgo from "javascript-time-ago";

// English.
import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);

ReactDOM.render(<App />, document.getElementById("root"));
