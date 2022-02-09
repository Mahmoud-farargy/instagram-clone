import React, { Fragment, memo } from "react";
import "./OptionsModal.scss";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as actionTypes from "../../../Store/actions/actions";

const OptionsModal = ({children, isUnfollowModal = false, closeModalFunc, changeModalState }, {...args}) => {
  const closeModal = (x) => {
    if((x.target.tagName === "SPAN" || x.target.tagName === "BUTTON") && !isUnfollowModal){
      if( closeModalFunc && typeof closeModalFunc === "function"){
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
const mapDispatchToProps = dispatch => {
  return {
      changeModalState: (modalType, hasDataList, usersList, usersType) => dispatch({type: actionTypes.CHANGE_MODAL_STATE, payload: {modalType, hasDataList, usersList, usersType}})
  }
}

export default connect(null, mapDispatchToProps)(memo(OptionsModal));
