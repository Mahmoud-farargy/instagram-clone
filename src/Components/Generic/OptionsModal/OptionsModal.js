import React, { Fragment, useContext } from "react";
import "./OptionsModal.scss";
import {AppContext} from "../../../Context";

const OptionsModal = (props, {args}) => {
  const { changeModalState, handleUnfollowingUsers } = useContext(AppContext);
  const closeModal = (x) => {
    if(x.target.tagName === "SPAN"){
      if(props?.isUnfollowModal){
        handleUnfollowingUsers({user: {}, state: false});
      }else{
        changeModalState("options",false);
      }
    }
  }
  return (
    <Fragment>
      <div {...args} id="optionsModal">
        <div onClick={(z) => closeModal(z)} className="optionsM--container--inner modalShow flex-column">
          {props.children}
        </div>
      </div>
    </Fragment>
  );
};
export default OptionsModal;
