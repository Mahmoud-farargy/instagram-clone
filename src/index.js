import React from "react";
import ReactDOM from "react-dom";
import App from "./Components/App/App";
import GlobalStyles from "./Design/GlobalStyles";
import 'bootstrap/dist/css/bootstrap.min.css';
import "font-awesome/css/font-awesome.min.css";
import { AppProvider } from "./Context";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./Store/index";
import ErrorBoundary from "./Components/HOC/ErrorBoundries";

// 2024 NOTES:
// - CODE SHOULD BE REFACTORED
// - CONTEXT API SHOULD BE REPLACED WITH REDUX FOR BETTER STORAGE ORGANIZATION AND TO AVOID UNNECESSARY RE-RENDERINGS
// - BOOTSTRAP AND SCSS SHOULD BE REPLACED WITH STYLED COMPONENTS
// - I WAS MAKING THIS APP TO PRACTICE REACT.JS BACK IN 2020

const mainApp = (
  <React.StrictMode>
    <Provider store={store} >
      <AppProvider>
        <BrowserRouter>
          <GlobalStyles />
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </BrowserRouter>
      </AppProvider>
    </Provider>
  </React.StrictMode>

);

ReactDOM.render(mainApp, document.getElementById("react-root"));
