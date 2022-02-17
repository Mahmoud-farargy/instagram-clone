import React, { Component } from "react";
import ErrorRoute from "../../Pages/ErrorRoute/ErrorRoute";

class ErrorBoundary extends Component {
  state = {
    hasError: false
  };

  static getDerivedStateFromError = () => {
    return { hasError: true };
  };

  componentDidCatch = (error, info) => {
    console.error("ERROR INFO >>", error, info);
  };

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    return hasError ? <ErrorRoute type="500" /> : children;
  }
}

export default ErrorBoundary;