import React, {useState, useRef} from "react";
import {BiShowAlt, BiHide} from "react-icons/bi";

const PasswordInput = ({ val ,onPassChange, ...args }) => {
  const [isPassShown, setShowingPass] = useState(false);
  const passInputRef = useRef(null);
  const togglePassVisibility = () =>{
      if(passInputRef && passInputRef.current){
            setShowingPass(!isPassShown);
            isPassShown ?
            passInputRef.current.type = "password":
            passInputRef.current.type = "text" ;
      }
  }
  return (
    <div id="passInput">
        <input
        ref={passInputRef}
        {...args}
        required
        value={val}
        onChange={(e) => onPassChange(e.target.value)}
        type="password"
        placeholder="Password"
        autoComplete="off"
        /> 
        <span onClick={() => togglePassVisibility()} className="password__visibiliry__ico">
            {
                isPassShown ?
                <BiHide />:<BiShowAlt />
            } 
        </span>        
    </div>
  );
};
export default PasswordInput;
