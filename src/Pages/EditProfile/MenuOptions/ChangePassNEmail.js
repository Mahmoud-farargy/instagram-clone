import React, {useContext, useState}from "react";
import Auxiliary from "../../../Components/HOC/Auxiliary";
import {AppContext} from "../../../Context";
import InputForm from "../../../Components/Generic/InpuForm/InputForm";
import {auth} from "../../../Config/firebase";
import firebase from "firebase";
import {Avatar} from "@material-ui/core";

const ChangePassNEmail = () => {
    const {receivedData, currentUser, notify, confirmPrompt} = useContext(AppContext);
    //useState
    const [formState, setForm] = useState({
        email: {regexRules:  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, value: currentUser?.email},
        oldPassword: {regexRules: /ff/ , value: ""},
        newPassword: {regexRules: /ff/ , value: ""},
        confirmPassword: {regexRules: /ff/ , value: ""},
    });
    
    const onInputChange = (val, name) => setForm({ ...formState,[name]: {...formState[name], value: val}}); 
    // useEffect(() =>{
    //     setForm
    // },[receivedData, currentUser]);
    const onSubmission = (event, formType) => {
        event.preventDefault();
        const credentials = firebase.auth.EmailAuthProvider.credential('user5@gmail.com', '123456'); //re-make this credential option AND DONT FORGET TO APPLY CREDENTIALS ON DELETE USER
        firebase.app().auth().currentUser.reauthenticateAndRetrieveDataWithCredential(credentials).then((res)=>{
            console.log(res, "fff");
            if(formType === "email"){
                auth.currentUser.updateEmail(formState?.email.value).then(() =>{
                    notify("Email updated successfully", "success");
                }).catch((err) =>{
                    notify(err, "error");
                });
            }else if (formType === "password"){

                auth.currentUser.updatePassword(formState?.newPassword.value).then(() => {
                    notify("Password updated successfully", "success");
                }).catch((error) =>{
                    notify(error || "An error has occurred. Try again later!", "error");
                })
            }
        });

       
    }
    const verifyEmail =()=> {
      const buttons =  [{
                    label: "Cancel",
                
                },
                {
                    label: "Confirm",
                    onClick: () => {
                        auth.currentUser.sendEmailVerification().then(() =>{
                            notify("Verification message sent successfully.Please check your email", "success");
                        }).catch((err) => {
                            notify(err || "An error has occurred. Try again later!", "error");
                        });
                    },
                }
            ]
         confirmPrompt("Confirmation", buttons, "Verify Email?");
        
    }
    
    return(
        <Auxiliary>
    <div className="option--container">
         <div className="flex-row change--photo mb-3">
          <Avatar className="user__picture mr-4" alt={receivedData?.userName} src="f" />
          <h1 className="user__prof__name">{receivedData?.userName}</h1>
        </div>
        {/* email form */}
        <form className="mb-4" onSubmit={(k) => onSubmission(k, "email")}>
            <InputForm
                type="text"
                label="email"
                name="email"
                changeInput={onInputChange}
                val={formState?.email.value}
            />
           <div className="form--btns flex-row">
               <input type="submit" disabled={!formState?.email.regexRules.test(formState?.email.value) || formState?.email.value === currentUser?.email} className={!formState?.email.regexRules?.test(formState?.email.value) || formState?.email.value === currentUser?.email ? "disabled profile__btn prof__btn__followed mb-2" : "profile__btn prof__btn__followed mb-2"} value="Change Email"/>  
               <span onClick={()=> verifyEmail()} className="change__prof__pic mt-3">Verify Email</span>
            </div>
        </form>
        {/* Password form */}
        <form onSubmit={(p) => onSubmission(p, "password")}>
            <InputForm
                type="text"
                label="old password"
                name="oldPassword"
                changeInput={onInputChange}
                val={formState?.oldPassword.value}
            />
            <InputForm
                type="text"
                label="new password"
                name="newPassword"
                changeInput={onInputChange}
                val={formState?.newPassword.value}
            />
            <InputForm
                type="text"
                label="confirm new password"
                name="confirmPassword"
                changeInput={onInputChange}
                val={formState?.confirmPassword.value}
            />
            <input type="submit" value="Change Password" />
        </form>  
    </div>
     
    
        </Auxiliary>
    )
}

export default ChangePassNEmail;