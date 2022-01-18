import React, { Fragment, useState, useRef } from "react";
import PropTypes from "prop-types";
import { BiShowAlt, BiHide } from "react-icons/bi";
import "./AuthInput.scss";

const AuthInput = ({ inputType, type, val, title, onInputChange, isSubmitted, isValid, errorMsg, name, ...args }) => {
    const [isFocused, setFocusing] = useState(false);
    const [isPassShown, setShowingPass] = useState(false);
    const passInputRef = useRef(null);
    const togglePassVisibility = () => {
        if (passInputRef && passInputRef.current) {
            setShowingPass(!isPassShown);
            isPassShown ?
                passInputRef.current.type = "password" :
                passInputRef.current.type = "text";
        }
    }
    return (
        <Fragment>
            <div className={`animate--input ${!isValid && isSubmitted && "invalid__input"
                } ${(val || isFocused) && "active__input"}`}>
                <label htmlFor={title}>{title}</label>
                {
                    inputType?.toLowerCase() === "text" ?
                        <input
                            onFocus={() => setFocusing(true)}
                            onBlur={() => setFocusing(false)}
                            {...args}
                            value={val}
                            onChange={(e) => onInputChange(e.target.value, name)}
                            type={type ? type : "text"}
                            name={name}
                            data-cy={type}
                            data-testid={`${type}-auth-input`}
                            id={title}
                        />
                        : inputType?.toLowerCase() === "password" ?
                            < >
                                <input
                                    onFocus={() => setFocusing(true)}
                                    onBlur={() => setFocusing(false)}
                                    ref={passInputRef}
                                    {...args}
                                    value={val}
                                    onChange={(e) => onInputChange(e.target.value, name)}
                                    type="password"
                                    autoComplete="off"
                                    name={name}
                                    data-cy="password"
                                    spellCheck="false"
                                    id={title}
                                />
                                <span onClick={() => togglePassVisibility()} className="password__visibiliry__ico">
                                    {
                                        val ?
                                            isPassShown ?
                                                <BiHide /> : <BiShowAlt />
                                            : null
                                    }
                                </span>
                            </>
                            :
                            <input
                                onFocus={() => setFocusing(true)}
                                onBlur={() => setFocusing(false)}
                                {...args}
                                value={val}
                                onChange={(e) => onInputChange(e.target.value, name)}
                                type="text"
                                data-cy={type}
                                id={title}
                            />
                }
            </div>
            {(!isValid && isSubmitted && errorMsg) && <small className="text-danger my-1">{errorMsg}</small>}
        </Fragment>
    );
};
AuthInput.propTypes = {
    type: PropTypes.string,
    inputType: PropTypes.string.isRequired,
    val: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    onInputChange: PropTypes.func.isRequired,
    isValid: PropTypes.bool.isRequired,
    isSubmitted: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired
};
export default AuthInput;
