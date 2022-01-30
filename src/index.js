import React from "react";
import ReactDOM from "react-dom";
import App from "./Components/App/App";
import GlobalStyles from "./Design/GlobalStyles";
import 'bootstrap/dist/css/bootstrap.min.css';
import "font-awesome/css/font-awesome.min.css";
import { AppProvider } from "./Context";
import { BrowserRouter } from "react-router-dom";

const mainApp = (
  <React.StrictMode>
    <AppProvider>
      <BrowserRouter>
      <GlobalStyles />
        <App />
      </BrowserRouter>
    </AppProvider>
  </React.StrictMode>

);

ReactDOM.render(mainApp, document.getElementById("react-root"));
