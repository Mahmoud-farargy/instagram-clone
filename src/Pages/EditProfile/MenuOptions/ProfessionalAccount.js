import React, {
  useContext,
  lazy,
  Suspense,
  Fragment,
  useState,
  useEffect,
  useRef
} from "react";
import { AppContext } from "../../../Context";
import { CategoryList } from "../../../Lists/Lists";
import { updateObject, capFirstLetter } from "../../../Utilities/Utility";
import { withRouter } from "react-router-dom";
import CheckboxIOS from "../../../Components/Generic/CheckboxIOS/CheckboxIOS";
import Moment from "react-moment";
import * as Consts from "../../../Utilities/Consts";
import { retry } from "../../../Utilities/RetryImport" ;
import { connect } from "react-redux";
import { updateSuggestionsListAsync } from "../../../Store/actions/actionCreators";

// lazy loading
const InputForm = lazy(() =>
  retry(() =>
    import("../../../Components/Generic/InpuForm/InputForm")
));

const ProfessionalAccount = (props) => {
  const _isMounted = useRef(true);
  const { history, updateSuggestionsList } = props;
  const { receivedData, handleEditingProfile, notify , confirmPrompt, currentUser, handleFollowRequests } = useContext(AppContext);
  //useState
  const [formState, setForm] = useState({
    professionalAcc: { category: "", show: true, status: true, suggested: true, reelsForFollowing: false, notificationBell:{state: true, type: "Both"}, private: false, suggNotFollowed: false, disableComments: false, fontFam: Consts.availableFonts.RALEWAY},
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
  const onNotificationInputChange = (val, name) => {
    setForm({
      ...formState,
      professionalAcc: { ...formState.professionalAcc, notificationBell:{...formState.professionalAcc.notificationBell, [name]: val} },
    });
  }
  useEffect(() => () => _isMounted.current = false, []);
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
      // if your acc turned public and you have some previous follow requests, accept them all
      if(!formState?.professionalAcc?.private && receivedData?.followRequests?.received?.length >0){
        receivedData.followRequests.received.forEach(item => {
          const {uid, userName, userAvatarUrl, isVerified} = item;
          handleFollowRequests({type: "confirm", userId: uid, userAvatarUrl, userName, isVerified});
        })      
      }
      handleEditingProfile(formState?.professionalAcc, "professionalAcc").then(( ) => {
        if(_isMounted.current){
            updateSuggestionsList();
            notify("Profile updated", "success");
            history.push("/profile");
        }
      }).catch((err) => {
        if(_isMounted.current){
           notify( err?.message || "An error occurred. Try again later.", "error");
        }
      });
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
  function calculateAge(birthday) {
    if(birthday && birthday instanceof Date){
      var ageDifMs = Date.now() - birthday?.getTime();
      var ageDate = new Date(ageDifMs);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
  }
  return (
    <Fragment>
      <div className="option--container fadeEffect">
        <form onSubmit={(s) => onSubmission(s)} className="flex-column">
        <Suspense fallback={<div><div className="global__loading"><span className="global__loading__inner"></span></div></div>}>
            <InputForm
              type="select"
              changeInput={onInputChange}
              label="category"
              name="category"
              options={formState?.catOptions}
              submitted={formState?.submitted}
              val={formState?.professionalAcc?.category}
            />  
            <InputForm
              type="select"
              changeInput={onInputChange}
              label="Font style"
              name="fontFam"
              options={Object.values(Consts.availableFonts)?.length > 0 ? Object.values(Consts.availableFonts).map(el => capFirstLetter(el)) : []}
              titles={Object.keys(Consts.availableFonts)?.length > 0 ? Object.keys(Consts.availableFonts).map(el => capFirstLetter(el)) : []}
              submitted={formState?.submitted}
              val={formState?.professionalAcc?.fontFam}
            />
           <div id="input--form--field">
              <div className=" form-group flex-column">
                <div className="prof--input--row flex-row">
                     <label htmlFor="private">Account Privacy</label>
                <CheckboxIOS checked={(formState?.professionalAcc?.private || false)} changeInput={onInputChange} id="private" name="private" />
                </div>
             <small>When your account is private, only people you approve can see your photos, music and videos on Voxgram. Your existing followers won't be affected.</small>
              </div>
              
            </div>

            <div id="input--form--field">
              <div className="form-group flex-column">
                <div className="prof--input--row  flex-row">
                  <label htmlFor="disableComments">Turn off commenting</label>
                  <CheckboxIOS checked={(formState?.professionalAcc?.disableComments || false)} changeInput={onInputChange} id="disableComments" name="disableComments" />
              </div>
              </div>
              
            </div>
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
                     <label htmlFor="suggNotFollowed">Don't suggest people who I followed</label>
                <CheckboxIOS checked={(formState?.professionalAcc?.suggNotFollowed || false)} changeInput={onInputChange} id="suggNotFollowed" name="suggNotFollowed" />
                </div>
              </div>
              
            </div>

            <div id="input--form--field">
              <div className=" form-group flex-column">
                <div className="prof--input--row flex-row">
                     <label htmlFor="reelsForFollowing">Show reels of only people I followed</label>
                <CheckboxIOS checked={(formState?.professionalAcc?.reelsForFollowing || false)} changeInput={onInputChange} id="reelsForFollowing" name="reelsForFollowing" />
                </div>
              </div>
            </div>
            
            <div id="input--form--field">
              <div className=" form-group flex-column">
                <div className="prof--input--row flex-row">
                     <label htmlFor="notificationBell">Notification Bell</label>
                <CheckboxIOS checked={(formState?.professionalAcc?.notificationBell?.state)} changeInput={onNotificationInputChange} id="notificationBell" name="state" />
                </div>
              </div>
           {
             formState?.professionalAcc?.notificationBell?.state &&
              <div>
              <InputForm
                  type="select"
                  changeInput={onNotificationInputChange}
                  label="notify me on: "
                  name="type"
                  options={["New Updates", "New Messages", "Both"]}
                  submitted={formState?.submitted}
                  val={formState?.professionalAcc?.notificationBell?.type}
                />
              </div>
           }  
            </div>
          </Suspense>
          <div className="form--btns flex-row">
            <input
              type="submit"
              disabled={!isFormValid}
              value="Save"
              className={
                !isFormValid
                  ? "disabled profile__btn primary__btn mb-2"
                  : "profile__btn primary__btn mb-2"
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
                              <span>Joined:</span>
                              {new Date(currentUser?.metadata?.creationTime).toDateString() + " "}
                              (<Moment fromNow withTitle>{new Date(currentUser?.metadata?.creationTime).toISOString()}</Moment>)
                            </div>
                            <div className="account--info--text">
                              <span>Last time you signed in:</span>
                              {new Date(currentUser?.metadata?.lastSignInTime).toDateString() + " "}
                              (<Moment fromNow withTitle>{currentUser?.metadata?.lastSignInTime}</Moment>)
                            </div>
                            {
                              receivedData?.profileInfo?.birthday &&
                              <div className="account--info--text">
                                <span>Your age is: </span>{calculateAge(new Date(receivedData?.profileInfo?.birthday))} Years old
                              </div>
                            }
                            {
                              currentUser?.email &&
                              <div className="account--info--text">
                                <span>Email: </span>{currentUser?.email}
                              </div>
                            }
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
const mapDispatchToProps = dispatch => {
  return {
      updateSuggestionsList: () => dispatch(updateSuggestionsListAsync())
  }
}
export default  connect( null, mapDispatchToProps )(withRouter(ProfessionalAccount));
