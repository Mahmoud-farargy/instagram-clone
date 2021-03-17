import React from "react";
import ReactDOM from "react-dom";
import App from "./Components/App/App";
import { AppProvider } from "./Context";
import { BrowserRouter } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";

const mainApp = (
  <AppProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AppProvider>
);

ReactDOM.render(mainApp, document.getElementById("app"));
