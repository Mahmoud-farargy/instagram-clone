import React, {Component, Fragment} from "react";

const ErrorComponent = ({error, info}) => {
    return (
        <Fragment>
            <h1>An error has been catched.</h1>
            <p>{error}</p>
            <p>{info}</p>
        </Fragment>
    )
};


class ErrorBoundary extends Component {
    state = {
      hasError: false,
      error: { message: '', stack: '' },
      info: { componentStack: '' }
    };
  
    static getDerivedStateFromError = error => {
      return { hasError: true };
    };
  
    componentDidCatch = (error, info) => {
      this.setState({ error, info });
    };
  
    render() {
      const { hasError, error, info } = this.state;
      const { children } = this.props;
  
      return hasError ? <ErrorComponent error={error} info={info}/> : children;
    }
  }

export default ErrorBoundary;