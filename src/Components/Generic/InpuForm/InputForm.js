import React, { Fragment, useEffect } from "react";
import "./InputForm.scss";

const InputForm = (props) => {
  const classes = ["form-group", "flex-row"];

  useEffect(() => {
    props.className && classes.push(props.className);
  }, []);
  return (
    <Fragment>
      <div id="input--form--field">
        {props.type === "text" ? (
          <div className={classes.join(" ")}>
            <label htmlFor={props.label}>{props.label}</label>
            <div className="form--input--side">
              <input
                className={props.disabled && "disabled"}
                id={props.label}
                value={props.val || ""}
                name={props.label}
                onChange={(x) => props.changeInput(x.target.value, props.name)}
                placeholder={props.label}
              />
              {props.extraText ? props.extraText : null}
              {/*You can also use props.children with closing tag*/}
              {!props.val && props.submitted && (
                <div className="text-danger">
                  <p>Required</p>
                </div>
              )}
            </div>
          </div>
        ) : props.type === "textarea" ? (
          <div className="form-group flex-row">
            <label htmlFor={props.label}>{props.label}</label>
            <div className="form--input--side">
              <textarea
                className={props.disabled && "disabled"}
                id={props.label}
                name={props.label}
                onChange={(x) => props.changeInput(x.target.value, props.name)}
                placeholder={props.label}
                defaultValue={props.val || ""}
              />
              {props.extraText ? props.extraText : null}
              {!props.val && props.submitted && (
                <div className="text-danger">
                  <p>Required</p>
                </div>
              )}
            </div>
          </div>
        ) : props.type === "select" ? (
          <div className={classes.join(" ")}>
            <label htmlFor={props.label}>{props.label}</label>
            <div className="form--input--side">
              <select
                className={props.disabled && "disabled"}
                id={props.label}
                value={props.val || ""}
                name={props.label}
                onChange={(x) => props.changeInput(x.target.value, props.name)}
                placeholder={props.label}
              >
                <option disabled>Select</option>
                {props.options &&
                  props.options.length > 0 &&
                  props.options?.map((item, i) => {
                    return <option key={i}>{item}</option>;
                  })}
              </select>
              {props.extraText ? props.extraText : null}
              {/*You can also use props.children with closing tag*/}
              {!props.val && props.submitted && (
                <div className="text-danger">
                  <p>Required</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={classes.join(" ")}>
            <label htmlFor={props.label}>{props.label}</label>
            <div className="form--input--side">
              <input
                className={props.disabled && "disabled"}
                id={props.label}
                value={props.val || ""}
                name={props.label}
                onChange={(x) => props.changeInput(x.target.value, props.name)}
                placeholder={props.label}
              />
              {props.extraText ? props.extraText : null}
              {/*You can also use props.children with closing tag*/}
              {!props.val && props.submitted && (
                <div className="text-danger">
                  <p>Required</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default InputForm;
