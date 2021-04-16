import React from "react";
import PropTypes from "prop-types";
import "./SignInOption.scss";

const SignInOption = (props) => {
    const {method, signInFunc} = props;
    const optionTitle = `Log In with ${method}`;
    return (
        <>
            <span  onClick={()=> !props.isLoading && signInFunc(`${method}Provider`) } className={`signIn__Btn ${method}__auth ${props.isLoading && "disabled"}`}>
               <img src={require(`../../../Assets/Sign-In-logos/${method}.svg`)} alt={method+ "logo"} /> {optionTitle}
            </span>
        </>
    )
}
SignInOption.propTypes = {
    method: PropTypes.string.isRequired,
    signInFunc: PropTypes.func.isRequired,
    isLoading: PropTypes.bool
}
export default SignInOption;