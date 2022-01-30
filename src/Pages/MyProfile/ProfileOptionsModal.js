import React, {memo} from 'react';
import OptionsModal from "../../Components/Generic/OptionsModal/OptionsModal";

const ProfileOptionsModal = ({changeDirection, isEmailAndNotAnon, authLogout,history}) =>{
  return ( 
  <OptionsModal>
    <span onClick={() => changeDirection(1, "Professional_Account")}>Account settings</span>
   {isEmailAndNotAnon &&<span onClick={() => changeDirection(2, "Change_Password_or_Email")}>Change password or email</span>}
  
   <span onClick={() => changeDirection(3, "Blocked_Users")}>Manage blocked accounts</span>
   <span onClick={() =>  changeDirection(5, "Themes")}>Change Theme</span>
   <span onClick={() =>  changeDirection(4, "Feedback") }>Report a problem/Rate app</span>
   <span className="mobile-only" onClick={() =>  history.push("/about")}>About</span>
   <span onClick={()=> authLogout(history)}>Log out</span>
   <span>Cancel</span>
</OptionsModal>);
}
export default memo(ProfileOptionsModal);