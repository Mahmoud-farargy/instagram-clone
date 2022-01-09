import React, { Fragment, memo } from "react";
import PropTypes from "prop-types";
import Loader from "react-loader-spinner";

const AuthSubmissionBtn = ({type = "login",value = "Log In",formState = {}, loading = false, inProgress = false, isRecapVerified = false}) => {
    const disabledConfig = () => {
        let isInvalid
        switch(type) {
            case "login":
            isInvalid = loading || inProgress || (!formState.loginEmail?.val || !formState.loginPassword?.val);
            break;
            case "signUp":
            isInvalid = loading || inProgress || !isRecapVerified || (!formState.signUpEmail?.val ||
            !formState.signUpPassword?.val ||
            !formState.signUpUsername?.val ||
            !formState.fullName?.val);
            break;
            default:
            isInvalid = loading || inProgress || (!formState.loginEmail?.val || !formState.loginPassword?.val);
        }
        return isInvalid;
    }  

    return (
       <Fragment>
              {loading || inProgress ? (
                          <button
                            className="disabled loading__btn flex-row"
                            disabled={true}
                          >
                            <Loader
                              type="ThreeDots"
                              color="var(--white)"
                              height={15}
                              width={20}
                              arialLabel="loading-indicator"
                            />
                          </button>
                        ) : (
                          <input
                            data-testid={`${type}-sub-btn`}
                            className={
                             disabledConfig()
                                ? "disabled"
                                : ""
                            }
                            disabled={
                              disabledConfig()
                            }
                            type="submit"
                            value={value}
                          />
                        )}
       </Fragment>
    )
}
AuthSubmissionBtn.propTypes = {
    value: PropTypes.string.isRequired,
    formState: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    inProgress: PropTypes.bool.isRequired,
    isRecapVerified: PropTypes.bool.isRequired
}
export default memo(AuthSubmissionBtn);