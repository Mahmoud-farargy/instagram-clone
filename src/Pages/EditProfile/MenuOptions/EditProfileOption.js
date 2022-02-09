import React, { Suspense, lazy, useContext, useState, useEffect, useRef, memo } from "react";
import Auxiliary from "../../../Components/HOC/Auxiliary";
import { Avatar } from "@material-ui/core";
import { AppContext } from "../../../Context";
import { auth } from "../../../Config/firebase";
import { withRouter } from "react-router-dom";
import OptionsModal from "../../../Components/Generic/OptionsModal/OptionsModal";
import { storage, storageRef } from "../../../Config/firebase";
import { GoVerified } from "react-icons/go";
import { retry } from "../../../Utilities/RetryImport";
import { connect } from "react-redux";
import * as Consts from "../../../Utilities/Consts";
import * as actionTypes from "../../../Store/actions/actions";

const InputForm = lazy(() => 
    retry(() =>
  import("../../../Components/Generic/InpuForm/InputForm")
));

const EditProfileOption = (props) => {
  const { changeModalState, modalsState } = props;
  // refs
  const _isMounted = useRef(true);
  const fileUploader = useRef(null);
  // --x--end of refs-x--//
  // state
  const [formState, setForm] = useState({
    name: "",
    website: "",
    bio: "",
    phoneNumber: "",
    gender: "Male",
    status: "Single",
    birthday: "",
    theme: "lightMode"
  });
  const [submitted, setSubmission] = useState(false);
  const [isLoading, setLoading] = useState(false);
  // --x--end of state-x--//
  const {
    receivedData,
    currentUser,
    handleEditingProfile,
    notify,
    changeProfilePic,
  } = useContext(AppContext);
  // useEffct
  useEffect(() => () => _isMounted.current = false, []);
  useEffect(() => {
    if (
      receivedData &&
      receivedData?.profileInfo &&
      Object.keys(receivedData?.profileInfo).length > 0
    ) {
      let copiedArr = JSON.parse(JSON.stringify(formState));
      Object.keys(receivedData?.profileInfo).map((item) => copiedArr[item] = receivedData?.profileInfo[item]);
      setForm(copiedArr);
    }
  }, [receivedData]);
  //-x- end of useEffect -x-//

  const { userName } = receivedData;
  let isFormValid = true; //makes sure all fields are filled and at least one of the fields does not match the already existing data
  if (Object.keys(formState).length > 0) {
    isFormValid =
      formState?.bio && formState?.name &&
      Object.keys(formState).some(
        (item) => formState[item] !== receivedData?.profileInfo?.[item]
      );
  }

  const submitForm = (e) => {
    e.preventDefault();
    const curr = auth.currentUser;
    setSubmission(true);
    if (formState?.bio && formState?.name && formState?.birthday) {
      setLoading(true);
      curr.updateProfile({
        displayName: formState.name,
        phoneNumber: formState.phoneNumber,
      }).then(() => {
        if(_isMounted.current){
            setLoading(false);
            handleEditingProfile(formState, "editProfile");
            notify("Profile updated", "success");
            props.history.push("/profile");
        }
      }).catch((err) => {
        if(_isMounted.current){
            setLoading(false);
            notify(err?.message || "An error occurred. Please try again later", "error");
        }
      });
    }
  };

  const onInputChange = (val, name) => {
    setForm({
      ...formState,
      [name]: val,
    });
  };
  const changePhoto = (process) => {
    if (process === "update") {
      fileUploader?.current && fileUploader.current.click();
    } else if (process === "delete") {
      if(receivedData?.profileInfo?.registrationMethod?.toLowerCase() === "email"){
          (async function (myUid){
        return await storageRef
                .child(`/avatars/${myUid}`)
                .delete()
                .then(() => {
                  if(_isMounted?.current){
                    changeProfilePic("");
                    notify("Profile picture removed.", "success"); 
                  }
                })
                .catch((err) => {
                  if(_isMounted?.current){
                      notify((err?.message || "Failed to remove picture. Please try again later."), "error");
                  }
                });
          })(receivedData?.uid);
      }else{
        changeProfilePic("");
        notify("Profile picture removed.", "success"); 
      }
     

     
    }
  };
  const onPhotoChange = (e) => {
    const uploadedPhoto = e.target.files[0];
    if (uploadedPhoto) {
      const metadata = {
        contentType: uploadedPhoto?.type,
      };
      if (
        /(image)/g.test(metadata.contentType) &&
        uploadedPhoto.size <= 12378523
      ) {
        if (uploadedPhoto?.name.split("").length <= 200) {
          notify("In progress...");
          const uploadContent = storage
            .ref(`avatars/${receivedData?.uid}`)
            .put(uploadedPhoto, metadata);
          uploadContent.on(
            "state_changed",
            () => {},
            (error) => {
              notify(error.message, "error");
            },
            () => {
              const curr = auth.currentUser;
              storage
                .ref(`/avatars`)
                .child(receivedData?.uid)
                .getDownloadURL()
                .then((url) => {
                  if(_isMounted?.current){
                    changeProfilePic(url);
                    curr.updateProfile({
                      photoURL: url,
                    });
                    notify("Profile picture updated successfully.", "success");
                  }
                }).catch((err) => {
                  if(_isMounted?.current){
                    notify((err?.message ||"Failed to upload picture.Please try again later"), "error");
                  }
                });
            }
          );
        } else {
          notify(
            `The name of the photo is too long. it should not exceed 200 characters`,
            "error"
          );
        }
      } else {
        notify(
          "Please choose a photo that doesn't exceed the size of 12MB.",
          "error"
        );
      }
    }
  };
  return (
    <Auxiliary>
      {/* modals */}
      {modalsState?.options && (
        <OptionsModal>
          <div className="py-4 profile--img--title option__font text-center">
            Change Profile Photo
          </div>
          <span
            className="text-primary option__font"
            onClick={() => changePhoto("update")}
          >
            upload photo
          </span>
         {
           receivedData?.userAvatarUrl &&
           <span
            className="text-danger option__font"
            onClick={() => changePhoto("delete")}
          >
            Remove current Photo
          </span>
         } 
          <span>Cancel</span>
        </OptionsModal>
      )}
      <input
        type="file"
        ref={fileUploader}
        id="fileUploader"
        accept="image/*"
        onChange={(e) => onPhotoChange(e)}
      />
      {/* --x-Modals-x-- */}
      <div className="option--container flex-column fadeEffect">
        <div className="flex-row change--photo">
          <Avatar
            className="user__picture mr-3"
            src={receivedData?.userAvatarUrl}
            onClick={() => changeModalState("options", true)}
            alt={userName}
          />
          <div className="user--pic--container flex-column">
            <div>
               <h1 className="user__prof__name">{userName}{receivedData?.isVerified && <span><GoVerified className="verified_icon"/></span>}</h1>
            </div>
            <button
              onClick={() => changeModalState("options", true)}
              className="change__prof__pic"
            >
              Change Profile Photo
            </button>
          </div>
        </div>
        <form
          className="flex-column edit--prof--form"
          onSubmit={(e) => submitForm(e)}
        >
           <Suspense fallback={<div><div className="global__loading"><span className="global__loading__inner"></span></div></div>}>
            <InputForm
              type="text"
              changeInput={onInputChange}
              label="name *"
              name="name"
              required={true}
              val={formState?.name}
              submitted={submitted}
              extraText={
                <small>
                  <strong>(Required)</strong>
                  Help people discover your account by using the name you're
                  known by: either your full name, nickname, or business name.
                  <br /> You can only change your name twice within 14 days.
                </small>
              }
            />
            <InputForm
              type="text"
              changeInput={onInputChange}
              label="User Name"
              name="userName"
              disabled={true}
              submitted={false}
              val={userName}
              extraText={
                <small>
                  The user name you choosed is not able to be changed.
                </small>
              }
            />

            <InputForm
              type="select"
              options={[
                "Single",
                "In a Relationship",
                "Married",
                "Engaged",
                "Complicated",
                "Divorced",
              ]}
              changeInput={onInputChange}
              label="status"
              name="status"
              val={formState.status}
              submitted={false}
            />

            <InputForm
              type="text"
              inputType="email"
              changeInput={onInputChange}
              label="email"
              name="email"
              disabled={true}
              submitted={false}
              val={currentUser?.email}
              extraText={
                <small>
                {
                  (receivedData?.profileInfo?.registrationMethod === "email" && receivedData?.uid !== "L9nP3dEZpyTg7AMIg8JBkrGQIji2") &&
                    <span
                      className="change__prof__pic"
                      onClick={() => props.changeIndex(2, "Change_Password_or_Email")}
                    >
                      Change Email?
                    </span>
                } 
                  <p className="mt-2">
                    This email won't be shown to anyone except you.
                  </p>
                  <p className="mt-2">
                    Verified email:{" "}
                    {currentUser?.emailVerified ? "Yes." : "No."}
                  </p>
                </small>
              }
            />

            <InputForm
              type="text"
              inputType="url"
              changeInput={onInputChange}
              label="website"
              name="website"
              submitted={false}
              val={formState?.website}
            />

            <InputForm
              type="textarea"
              changeInput={onInputChange}
              label="bio *"
              name="bio"
              val={formState?.bio}
              required={true}
              submitted={submitted}
              maxLength={100}
              extraText={
                <div>
                  <h2>Personal Information</h2>
                  <small>
                  <strong>(Required)</strong>
                    Provide your personal information, even if the account is used
                    for a business, a pet or something else.
                    <br /> This won't be a part of your public profile.
                  </small>
                </div>
              }
            />
            <InputForm
              type="text"
              inputType="date"
              changeInput={onInputChange}
              label="Date of birth *"
              name="birthday"
              required={true}
              val={formState?.birthday}
              submitted={submitted}
              max={`${new Date().getFullYear() -10}-01-01`}
              min={`${new Date().getFullYear() - 90}-01-01`}
              extraText={
                <small>
                  <strong>(Required)</strong>
                  Set your birthday so that your friends get notified when your birthday comes.
                </small>
              }
            />
            <InputForm
              type="text"
              inputType="tel"
              changeInput={onInputChange}
              label="phone number"
              name="phoneNumber"
              val={formState?.phoneNumber}
              submitted={false}
              extraText={
                <small>
                  This phone number won't be shown to anyone except you.
                </small>
              }
            />

            <InputForm
              type="select"
              changeInput={onInputChange}
              label="gender"
              name="gender"
              options={["Male", "Female"]}
              val={formState.gender}
              submitted={false}
            />
          </Suspense>
          <div className="form--btns flex-row">
            <input
              type="submit"
              disabled={(!isFormValid || isLoading)}
              value="Save"
              className={
                (!isFormValid || isLoading)
                  ? "disabled profile__btn primary__btn mb-2"
                  : "profile__btn primary__btn mb-2"
              }
            />
          </div>
        </form>
      </div>
    </Auxiliary>
  );
};
const mapDispatchToProps = dispatch => {
  return {
      changeModalState: (modalType, hasDataList, usersList, usersType) => dispatch({type: actionTypes.CHANGE_MODAL_STATE, payload: {modalType, hasDataList, usersList, usersType}})
  }
}
const mapStateToProps = state => {
  return {
      modalsState: state[Consts.reducers.MODALS].modalsState
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(memo(EditProfileOption)));
