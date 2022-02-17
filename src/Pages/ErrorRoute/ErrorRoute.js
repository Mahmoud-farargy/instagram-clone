import React, { useContext, useEffect } from "react";
import "./ErrorRoute.scss";
import { Link, withRouter } from "react-router-dom";
import Auxiliary from "../../Components/HOC/Auxiliary";
import PropTypes from "prop-types";
import { AppContext } from "../../Context";
import igGrayLogo from "../../Assets/instagram-icon-logo-loading.e195cbde.svg";
import error500Img from "../../Assets/500.svg";
import { RiArrowGoBackLine } from "react-icons/ri";
import { useHistory } from "react-router-dom";

const ErrorRoute = (props) => {
  const { type, location } = props;
  const { changeMainState } = useContext(AppContext);
  const history = useHistory();
  useEffect(() => {
    changeMainState(
      "currentPage",
      type.toLowerCase() === "404"
        ? "Page Not Found"
        : type.toLowerCase() === "403" ?
          "403 Forbidden Access"
          : type.toLowerCase() === "500" ?
            "Something went wrong"
            : "Unknown Error"
    );
  }, []);
  const directToHome = () => {
    history.replace("/");
    window.location.reload();
  }
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
          ) : type.toLowerCase() === "500" ? (
            <div className="error--500">
              <img src={error500Img} alt="something went wrong" loading="lazy" />
              <h2>Woops! something went wrong :(</h2>
              <p>Brace yourself till we get the error fixed.</p>
              <p>You may try again later</p>
              <div className="error--btn--container flex-row">
                <button onClick={() => directToHome()} className="primary__btn flex-row profile__btn">
                  <RiArrowGoBackLine /><span>Go home</span>
                </button>
              </div>
            </div>

          ) : (
            <div className="forbidden flex-column">
              <h2>Sorry, cannot access this page now.</h2>
            </div>
          )}
          {type.toLowerCase() !== "500" &&
            <div className="ig--error--error flex-row">
              <img loading="lazy" className="unselectable" src={igGrayLogo} alt="ig logo" />
            </div>}
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
