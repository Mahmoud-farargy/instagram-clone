import React, { Fragment, useContext } from "react";
import "./OptionsModal.scss";
import {AppContext} from "../../../Context";
import PropTypes from "prop-types";

const OptionsModal = ({children, isUnfollowModal = false, closeModalFunc}, {...args}) => {
  const { changeModalState, handleUnfollowingUsers } = useContext(AppContext);
  const closeModal = (x) => {
    if(x.target.tagName === "SPAN"){
      if(isUnfollowModal){
        handleUnfollowingUsers({user: {}, state: false});
      }else if( closeModalFunc && typeof closeModalFunc === "function"){
          closeModalFunc(false);
      }else{
        changeModalState("options",false);
      }
    }
  }
  return (
    <Fragment>
      <div {...args} id="optionsModal">
        <div onClick={(z) => closeModal(z)} className="optionsM--container--inner modalShow flex-column">
          {children}
        </div>
      </div>
    </Fragment>
  );
};
OptionsModal.propTypes ={
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  isUnfollowModal: PropTypes.bool,
  closeModalFunc: PropTypes.func
}
export default OptionsModal;
