import React from "react";
import PropTypes from "prop-types";
import "./SignInOption.scss";
import { FaUserAlt }  from "react-icons/fa";

const SignInOption = (props) => {
    const {method, signInFunc, isLoading, methTitle} = props;
    const optionTitle = method === "anonymous" ?  "Log in anonymously" : `Log In with ${method}`;
    return (
        <>
            <span title={methTitle} onClick={()=> !isLoading && signInFunc(`${method}Provider`) } className={`signIn__Btn ${method}__auth ${isLoading && "disabled"} d-flex`}>
            { method === "anonymous" ?  <FaUserAlt className="mr-2"/> : <img src={require(`../../../Assets/Sign-In-logos/${method}.svg`)} alt={method+ "logo"} />} <span>{optionTitle}</span>
            </span>
        </>
    )
}
SignInOption.propTypes = {
    method: PropTypes.string.isRequired,
    signInFunc: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    methTitle: PropTypes.string
}
SignInOption.defaultProps = {
    method: "google",
    isLoading: false,
    methTitle: ""
}
export default SignInOption;