import React, { Fragment, useEffect, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import "./InputForm.scss";

const InputForm = (props) => {
  const { hideLabel = false, widthCloseBtn = false, onCloseClick, payload, titles } = props;
  const [containerClasses, setContClasses] = useState(["form-group", "flex-row"]);

  useEffect(() => {
    props.className && setContClasses([...containerClasses, ...props.className.split(" ")]);
  }, [props.className]);
  const isInvalid = !props.val && props.submitted;
  const classItems = `${props.disabled ? "disabled" : ""} ${isInvalid ? "invalid__input" : ""}`;
  return (
    <Fragment>
      <div id="input--form--field">
        {props.type === "text" ? (
          <div className={containerClasses.join(" ")}>
            {!hideLabel && <label htmlFor={props.label}>{props.label}</label>}
            <div className="form--input--side">
              <input
                className={classItems}
                id={props.label}
                type={props.inputType ? props.inputType : "text"}
                value={props.val || ""}
                disabled={props.disabled}
                autoFocus={props.autoFocus}
                required={props.required}
                name={props.label}
                onChange={(x) => props.changeInput(x.target.value, props.name, payload)}
                placeholder={props.label}
                autoComplete="off"
                max={props.max}
                min={props.min}
                maxLength={props.maxLength}
                spellCheck={(props.inputType === "number" || props.inputType === "password" || props.inputType === "tel") ? "false" : "true"}
              />
              {(widthCloseBtn && typeof onCloseClick === "function") && <RiCloseLine onClick={() => onCloseClick({...payload})} title="Close input" className="delete__input__icon"/>}
              {props.extraText ? props.extraText : null}
              {/*You can also use props.children with closing tag*/}
              {isInvalid && (
                <div className="text-danger">
                  <p>Required</p>
                </div>
              )}
            </div>
          </div>
        ) : props.type === "textarea" ? (
          <div className={containerClasses.join(" ")}>
            {!hideLabel && <label htmlFor={props.label}>{props.label}</label>}
            <div className="form--input--side">
              <textarea
                className={classItems}
                id={props.label}
                name={props.label}
                disabled={props.disabled}
                autoFocus={props.autoFocus}
                maxLength={props.maxLength}
                onChange={(x) => props.changeInput(x.target.value, props.name, payload)}
                placeholder={props.label}
                defaultValue={props.val || ""}
              />
              {props.extraText ? props.extraText : null}
              {isInvalid && (
                <div className="text-danger">
                  <p>Required</p>
                </div>
              )}
            </div>
          </div>
        ) : props.type === "select" ? (
          <div className={containerClasses.join(" ")}>
            {!hideLabel && <label htmlFor={props.label}>{props.label}</label>}
            <div className="form--input--side">
              <select
                className={classItems}
                id={props.label}
                value={props.val || ""}
                name={props.label}
                disabled={props.disabled}
                autoFocus={props.autoFocus}
                onChange={(x) => props.changeInput(x.target.value, props.name, payload)}
                placeholder={props.label}
              >
                <option disabled>Select</option>
                {props.options &&
                  props.options.length > 0 &&
                  props.options?.map((item, i) => {
                    return <option value={item} key={i}>{ titles?.length > 0 ? titles[i] : item}</option>;
                  })}
              </select>
              {props.extraText ? props.extraText : null}
              {/*You can also use props.children with closing tag*/}
              {isInvalid && (
                <div className="text-danger">
                  <p>Required</p>
                </div>
              )}
            </div>
          </div>
        ) : props.type === "checkbox" ?
          <div className="flex-row">
            <input onChange={(x) => props.changeInput(x.target.checked, props.name, payload)} name={props.name} checked={props.val || false} type="checkbox" id={props.label} className="mr-2 mt-1 mb-3" />
            <label htmlFor={props.label} >{props.labelText}</label> 
          </div>
        : (
          <div className={containerClasses.join(" ")}>
            {!hideLabel && <label htmlFor={props.label}>{props.label}</label>}
            <div className="form--input--side">
              <input
                className={classItems}
                id={props.label}
                value={props.val || ""}
                type={props.inputType}
                name={props.label}
                onChange={(x) => props.changeInput(x.target.checked, props.name, payload)}
                placeholder={props.label}
              />
              {props.extraText ? props.extraText : null}
              {/*You can also use props.children within closing tags*/}
              {isInvalid && (
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
