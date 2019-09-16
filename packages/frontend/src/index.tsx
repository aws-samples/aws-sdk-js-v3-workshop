import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import Routes from "./Routes";

ReactDOM.render(
  <div className="container" style={{ height: "100vh" }}>
    <Routes />
  </div>,
  document.getElementById("root")
);

serviceWorker.unregister();
