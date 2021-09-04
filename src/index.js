import React from "react";
import ReactDOM from "react-dom";
import App from "./Components/App/App";
import "./Design/index.css";
import { AppProvider } from "./Context";
import { BrowserRouter } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css"
import 'react-multi-carousel/lib/styles.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

const mainApp = (
  <AppProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AppProvider>
);

ReactDOM.render(mainApp, document.getElementById("react-root"));
