import React, {
  useContext,
  lazy,
  Suspense,
  Fragment,
  useState,
  useEffect,
} from "react";
import { AppContext } from "../../../Context";
import { CategoryList } from "../../../Lists/Lists";
import { updateObject } from "../../../Utilities/Utility";
import { withRouter } from "react-router-dom";
import CheckboxIOS from "../../../Components/Generic/CheckboxIOS/CheckboxIOS";
import Moment from "react-moment";

const InputForm = lazy(() =>
  import("../../../Components/Generic/InpuForm/InputForm")
);

const ProfessionalAccount = (props) => {
  const { receivedData, handleEditingProfile, notify , confirmPrompt, currentUser } = useContext(AppContext);
  //useState
  const [formState, setForm] = useState({
    professionalAcc: { category: "", show: true, status: true, suggested: true, reelsForFollowing: false},
    catOptions: CategoryList,
    submitted: false,
  });

  //--x-end of useState-x--//
  const onInputChange = (val, name) => {
    setForm({
      ...formState,
      professionalAcc: { ...formState?.professionalAcc, [name]: val },
    });
  };

  useEffect(() => {
    setForm({
      ...formState,
      professionalAcc: receivedData?.profileInfo?.professionalAcc,
    });
  }, [receivedData]);
  let isFormValid = true;
  if (formState && formState?.professionalAcc) {
    isFormValid =
      Object.keys(formState?.professionalAcc).every(
        (item) => formState?.professionalAcc[item] !== ""
      ) &&
      Object.keys(formState?.professionalAcc).some(
        (item) =>
          formState?.professionalAcc[item] !==
          receivedData?.profileInfo?.professionalAcc[item]
      );
  }

  //functions
  const onSubmission = (e) => {
    e.preventDefault();
    setForm(updateObject(formState, { submitted: true }));
    if (isFormValid) {
      handleEditingProfile(formState?.professionalAcc, "professionalAcc");
      props.history.push("/profile");
      notify("Profile updated", "success");
    }
  };
  const onDeleteAccount = (x) => {
    x.stopPropagation(); //temporarily
    const buttons = [
      {
        label: "Cancel",
      },
      {
        label: "Confirm",
        onClick: () => {
          notify(
            "Deletion request submitted. Your account will be permanently deleted in 20 days max."
          );
          // storageRef.child(`content/${receivedData?.uid}`).delete().then(()=>{
          //make credentials first
          // auth.currentUser.delete().then(() => {
          //  .collection("users")
          //     .doc(receivedData?.uid)
          //     .delete()
          //     .then(() => {});
          //     props.history.replace("/auth");
          //     localStorage.clear();
          //     notify("Your account has been deleted. We are sad to see you go.");
          //     // }).catch(err=>{
          //     //     notify(err, "error");
          //     // });
          // });
        },
      },
    ];
    confirmPrompt(
      "Confirmation",
      buttons,
      "Are you sure you want to delete your account permanently?"
    );
  };
  return (
    <Fragment>
      <div className="option--container">
        <form onSubmit={(s) => onSubmission(s)} className="flex-column">
          <Suspense fallback={<h1>Loading...</h1>}>
            <InputForm
              type="select"
              changeInput={onInputChange}
              label="category"
              name="category"
              options={formState?.catOptions}
              submitted={formState?.submitted}
              val={formState?.professionalAcc?.category}
            />
            <div id="input--form--field">
              <div className="form-group flex-column">
                <div className="prof--input--row  flex-row">
                  <label htmlFor="show">Show category on profile</label>
                  <CheckboxIOS checked={(formState?.professionalAcc?.show || false)} changeInput={onInputChange} id="show" name="show" />
              </div>
              </div>
              
            </div>
            <div id="input--form--field">
              <div className=" form-group flex-column">
                <div className="prof--input--row flex-row">
                     <label htmlFor="status">Show Activity Status</label>
                <CheckboxIOS checked={(formState?.professionalAcc?.status || false)} changeInput={onInputChange} id="status" name="status" />
                </div>
             <small>Allow accounts you follow and anyone you message to see when you were last active on Voxgram app. When this is turned off, you won't be able to see the activity status of other accounts.</small>
              </div>
              
            </div>
            <div id="input--form--field">
              <div className=" form-group flex-column">
                <div className="prof--input--row flex-row">
                     <label htmlFor="suggested">Similar account suggestions</label>
                <CheckboxIOS checked={(formState?.professionalAcc?.suggested || false)} changeInput={onInputChange} id="suggested" name="suggested" />
                </div>
                <small>Include your account when recommending similar accounts people might want to follow.</small>
              </div>
              
            </div>
            <div id="input--form--field">
              <div className=" form-group flex-column">
                <div className="prof--input--row flex-row">
                     <label htmlFor="reelsForFollowing">Show reels of only people you follow</label>
                <CheckboxIOS checked={(formState?.professionalAcc?.reelsForFollowing || false)} changeInput={onInputChange} id="reelsForFollowing" name="reelsForFollowing" />
                </div>
              </div>
              
            </div>
           
          </Suspense>
          <div className="form--btns flex-row">
            <input
              type="submit"
              disabled={!isFormValid}
              value="Submit"
              className={
                !isFormValid
                  ? "disabled profile__btn prof__btn__followed mb-2"
                  : "profile__btn prof__btn__followed mb-2"
              }
            />
            <span
              className="change__prof__pic"
              onClick={(x) => onDeleteAccount(x)}
            >
              Permanently delete my account
            </span>

          </div>
        </form>
        <div id="input--form--field">
                  <div className="account--info--container flex-row">
                    <div className="form-group">
                      <div className="account--info--inner flex-row">
                        <label>Account Information</label>
                        <div className="account--info--box flex-column">
                            <div className="account--info--text">
                              <span>Created in:</span>
                              {new Date(currentUser?.metadata?.creationTime).toDateString() + " "}
                              (<Moment fromNow withTitle>{new Date(currentUser?.metadata?.creationTime).toISOString()}</Moment>)
                            </div>
                            <div className="account--info--text">
                              <span>Last time you signed in:</span>
                              {new Date(currentUser?.metadata?.lastSignInTime).toDateString() + " "}
                              (<Moment fromNow withTitle>{currentUser?.metadata?.lastSignInTime}</Moment>)
                            </div>
                            
                            <div className="account--info--text">
                              <span>Email: </span>{currentUser?.email}
                            </div>
                            <div className="account--info--text">
                              <span>UID: </span>{currentUser?.uid}
                            </div>
                        </div>
                      </div>
                    </div>
                </div> 
            </div>
      </div>
    </Fragment>
  );
};

export default withRouter(ProfessionalAccount);
