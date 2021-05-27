import React, { useContext, useEffect } from "react";
import "./ErrorRoute.scss";
import { Link, withRouter } from "react-router-dom";
import Auxiliary from "../../Components/HOC/Auxiliary";
import PropTypes from "prop-types";
import { AppContext } from "../../Context";
import igGrayLogo from "../../Assets/instagram-icon-logo-loading.e195cbde.svg";

const ErrorRoute = (props) => {
  const { type, location } = props;
  const { changeMainState } = useContext(AppContext);
  useEffect(() => {
    changeMainState(
      "currentPage",
      type.toLowerCase() === "404"
        ? "Page Not Found"
        : type.toLowerCase() === "403"
        ? "403 Forbidden Access"
        : "Unknown Error"
    );
  }, []);
  return (
    <Auxiliary>
      <section id="errorRoute">
        <div className="error--inner flex-column">
          {type.toLowerCase() === "404" ? (
            <div className="not--found flex-column">
              <h2>Sorry, this page isn't available.</h2>
              <h5>
                The link you followed may be broken, or the page may have been
                removed. <Link to="/">Go back to Voxgram.</Link>
              </h5>
              <p>{location.pathname} is not found.</p>
            </div>
          ) : (
            <div className="forbidden flex-column">
              <h2>Sorry, cannot access this page now.</h2>
            </div>
          )}
          <div className="ig--error--error flex-row">
            <img loading="lazy" className="unselectable" src={igGrayLogo} alt="ig logo" />
          </div>
        </div>
      </section>
    </Auxiliary>
  );
};

ErrorRoute.propTypes = {
  type: PropTypes.string,
  location: PropTypes.object,
};
export default withRouter(ErrorRoute);
