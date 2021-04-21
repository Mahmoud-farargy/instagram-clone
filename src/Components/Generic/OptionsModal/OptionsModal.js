import React, { Fragment } from "react";
import "./OptionsModal.scss";
const OptionsModal = (props, {args}) => {
  return (
    <Fragment>
      <div {...args} id="optionsModal">
        <div className="optionsM--container--inner flex-column">
          {props.children}
        </div>
      </div>
    </Fragment>
  );
};
export default OptionsModal;
