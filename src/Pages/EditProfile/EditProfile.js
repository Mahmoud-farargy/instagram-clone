import React, { PureComponent, lazy, Suspense } from "react";
import Auxiliary from "../../Components/HOC/Auxiliary";
import "./EditProfile.scss";
import {auth, db} from "../../Config/firebase";
import { Avatar } from "@material-ui/core";
import { AppContext } from "../../Context";
import {updateObject} from "../../Utilities/Utility";
import {withRouter} from "react-router-dom";

const InputForm = lazy(() =>
  import("../../Components/Generic/InpuForm/InputForm")
);
class EditProfile extends PureComponent {
  state = {
    form: {
        name: "",
        website: "",
        bio: "",
        phoneNumber: "",
        gender: "",
        status: "Single"
    },
    submitted: false,    
  };
  static contextType = AppContext;
  
  componentDidMount() {
    const {changeMainState, receivedData} = this.context;        
        console.log("data  >>>", receivedData);
        if(receivedData && receivedData?.profileInfo && Object.keys(receivedData?.profileInfo).length > 0){
                this.setState(updateObject(this.state, { form: receivedData?.profileInfo}));
        }
    changeMainState("currentPage", "Edit profile");
  }

  onInputChange = (val, name) => {
    this.setState({
      ...this.state,
      form: {
          ...this.state.form,
           [name]: val,
      }
    });
  };
  submitForm(e) {
    e.preventDefault();
    const {handleEditingProfile} = this.context; 
   const curr = auth.currentUser;
    this.setState(updateObject(this.state, {submitted: true}));
    if(Object.keys(this.state.form).every(item => this.state.form[item])){
        curr.updateProfile({
            displayName: this.state.form.name,
            // photoURL: ""
        });
        // curr.updateEmail(this.);
        handleEditingProfile(this.state.form);
       
        this.props.history.push("/profile");
    }
  }
  onDeleteAccount(x){
    const {receivedData} = this.context;   
    x.stopPropagation();
    console.log("delete clicked"); //temporarily
    if(window.confirm("Are you sure you want to delete your account permanently?")){
        console.log(receivedData?.uid);
        // storageRef.child(`content/${receivedData?.uid}`).delete().then(()=>{
            auth.currentUser.delete().then(()=>{
                db.collection("users").doc(receivedData?.uid).delete().then(()=>{
                    
                })
               this.props.history.replace("/auth");
                    localStorage.clear();
                    alert("User deleted");
            // }).catch(err=>{
            //     alert(err);
            // }); 
        });
        
    }
    
  }
  render() {
    const { receivedData, currentUser } = this.context;
    const {userName} = receivedData; //makes sure all fields are filled and at least one of the fields does not match the already existing data
    const isFormValid = Object.keys(this.state.form).every(item => this.state.form[item]) && Object.keys(this.state.form).some(item => this.state.form[item] !== receivedData?.profileInfo?.[item]);
    return (
      <Auxiliary>
        <section id="page">
          <div id="editProfile">
            <div className="edit--desktop">
              <div className="edit--box">
                <ul>
                  <li>kk</li>
                </ul>
                <div className="flex-column right--side">
                  <div className="right--inner flex-column">
                    <div className="flex-row change--photo">
                      <Avatar
                        className="user__picture mr-3"
                        alt={userName}
                        src="f"
                      />
                      <div className="user--pic--container flex-column">
                        <h1 className="user__prof__name">{userName}</h1>
                        <button className="change__prof__pic">
                          Change Profile Photo
                        </button>
                      </div>
                    </div>
                    <form
                      className="flex-column edit--prof--form"
                      onSubmit={(e) => this.submitForm(e)}
                    >
                      <Suspense fallback={<h1>Loading...</h1>}>
                        <InputForm
                          type="text"
                          changeInput={this.onInputChange}
                          label="name"
                          name="name"
                          val={this.state.form.name}
                          submitted={this.state.submitted}
                          extraText={
                            <small>
                              Help people discover your account by using the
                              name you're known by: either your full name,
                              nickname, or business name. <br /> You can only
                              change your name twice within 14 days.
                            </small>
                          }
                        />
                        <InputForm
                          type="text"
                          changeInput={this.onInputChange}
                          label="User Name"
                          name="userName"
                          disabled={true}
                          submitted={this.state.submitted}
                          val={userName}
                          extraText={
                            <small>
                              The user name you choosed is not able to be
                              changed.
                            </small>
                          }
                        />

                         <InputForm
                          type="select"
                          options={["Single","In a Relationship","Married","Engaged" ,"Complicated", "Divorced"]}
                          changeInput={this.onInputChange}
                          label="status"
                          name="status"
                          val={this.state.form.status}
                          submitted={this.state.submitted}
                        />

                         <InputForm
                          type="text"
                          changeInput={this.onInputChange}
                          label="email"
                          name="email"
                          disabled={true}
                          submitted={this.state.submitted}
                          val={currentUser?.email}
                          extraText={
                            <small>
                              The email you entered is not able to be
                              changed.
                              <p className="mt-2">This email won't be shown to anyone except you.</p>
                              <p className="mt-2">Verified email: {currentUser?.emailVerified ? "Yes." : "No."}</p>
                            </small>
                          }
                        />
                        
                        <InputForm
                          type="text"
                          changeInput={this.onInputChange}
                          label="website"
                          name="website"
                          submitted={this.state.submitted}
                          val={this.state.form.website}
                        />

                        <InputForm
                          type="textarea"
                          changeInput={this.onInputChange}
                          label="bio"
                          name="bio"
                          val={this.state.form.bio}
                          submitted={this.state.submitted}
                          extraText={
                              <small>
                                Provide your personal information, even if the
                                account is used for a business, a pet or
                                something else.<br /> This won't be a part of your
                                public profile.
                              </small>
                          }
                        />

                         <InputForm
                          type="text"
                          changeInput={this.onInputChange}
                          label="phone number"
                          name="phoneNumber"
                          val={this.state.form.phoneNumber}
                          submitted={this.state.submitted}
                          extraText={
                              <small>
                                   This phone number won't be shown to anyone except you.
                              </small>
                          }
                        />

                        <InputForm
                          type="select"
                          changeInput={this.onInputChange}
                          label="gender"
                          name="gender"
                          options={["Male", "Female"]}
                          val={this.state.form.gender}
                          submitted={this.state.submitted}
                        />

                      </Suspense>
                      <div className="form--btns flex-row">
                         <input
                            role="button"
                            type="submit"
                            disabled={!isFormValid}
                            value="Submit"
                            className={!isFormValid ? "disabled profile__btn prof__btn__followed mb-2" : "profile__btn prof__btn__followed mb-2"}
                        />  
                         <span
                            className="change__prof__pic mt-3"
                            onClick={(x) => this.onDeleteAccount(x)}
                        >Permanently delete my account</span>  
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="edit--mobile"></div>
          </div>
        </section>
      </Auxiliary>
    );
  }
}
export default withRouter(EditProfile);
