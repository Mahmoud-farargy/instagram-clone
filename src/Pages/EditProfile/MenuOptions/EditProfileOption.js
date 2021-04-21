import React, { Suspense, lazy, useContext, useState, useEffect } from "react";
import Auxiliary from "../../../Components/HOC/Auxiliary";
import { Avatar } from "@material-ui/core";
import { AppContext } from "../../../Context";
import { auth } from "../../../Config/firebase";
import { withRouter } from "react-router-dom";
import OptionsModal from "../../../Components/Generic/OptionsModal/OptionsModal";
import $ from "jquery";
import { storage } from "../../../Config/firebase";

const InputForm = lazy(() =>
  import("../../../Components/Generic/InpuForm/InputForm")
);

const EditProfileOption = (props) => {
  // state
  const [formState, setForm] = useState({
    name: "",
    website: "",
    bio: "",
    phoneNumber: "",
    gender: "Male",
    status: "Single",
  });
  const [submitted, setSubmission] = useState(false);
  // --x--end of state-x--//
  const {
    receivedData,
    currentUser,
    handleEditingProfile,
    notify,
    confirmPrompt,
    changeProfilePic,
    modalsState,
    changeModalState,
  } = useContext(AppContext);
  // useEffct
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
      Object.keys(formState).every((item) => formState[item]) &&
      Object.keys(formState).some(
        (item) => formState[item] !== receivedData?.profileInfo?.[item]
      );
  }
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
            "Deletion request has been submitted. Your account will be deleted in 48 hours max."
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
  const submitForm = (e) => {
    e.preventDefault();
    const curr = auth.currentUser;
    setSubmission(true);
    if (Object.keys(formState).every((item) => formState[item])) {
      curr.updateProfile({
        displayName: formState.name,
        phoneNumber: formState.phoneNumber,
      });
      handleEditingProfile(formState, "editProfile");
      props.history.push("/profile");
      notify("Profile updated", "success");
    }
  };

  const onInputChange = (val, name) => {
    setForm({
      ...formState,
      [name]: val,
    });
  };
  const changePhoto = (process) => {
    changeModalState("options",false);
    if (process === "update") {
      $("#fileUploader").trigger("click");
    } else if (process === "delete") {
      changeProfilePic("");
      notify("Profile picture removed.", "success");
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
        if (uploadedPhoto?.name.split("").length <= 50) {
          notify("In progress");
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
                  changeProfilePic(url);

                  curr.updateProfile({
                    photoURL: url,
                  });
                  notify("Profile picture updated successfully.", "success");
                });
            }
          );
        } else {
          notify(
            `The name of the photo is too long. it should not exceed 50 characters`,
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
          <span className="py-4 text-dark option__font">
            Change Profile Photo
          </span>
          <span
            className="text-primary option__font"
            onClick={() => changePhoto("update")}
          >
            upload photo
          </span>
          <span
            className="text-danger option__font"
            onClick={() => changePhoto("delete")}
          >
            Remove current Photo
          </span>
          <span onClick={() => changeModalState("options",false)}>Cancel</span>
        </OptionsModal>
      )}
      <input
        type="file"
        id="fileUploader"
        accept="image/*"
        onChange={(e) => onPhotoChange(e)}
      />
      {/* --x-Modals-x-- */}
      <div className="option--container flex-column">
        <div className="flex-row change--photo">
          <Avatar
            className="user__picture mr-3"
            src={receivedData?.userAvatarUrl}
            onClick={() => changeModalState("options", true)}
            alt={userName}
          />
          <div className="user--pic--container flex-column">
            <h1 className="user__prof__name">{userName}</h1>

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
          <Suspense fallback={<h1>Loading...</h1>}>
            <InputForm
              type="text"
              changeInput={onInputChange}
              label="name"
              name="name"
              val={formState?.name}
              submitted={submitted}
              extraText={
                <small>
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
              submitted={submitted}
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
              submitted={submitted}
            />

            <InputForm
              type="text"
              inputType="email"
              changeInput={onInputChange}
              label="email"
              name="email"
              disabled={true}
              submitted={submitted}
              val={currentUser?.email}
              extraText={
                <small>
                  <span
                    className="change__prof__pic"
                    onClick={() => props.changeIndex(2)}
                  >
                    Change Email?
                  </span>
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
              submitted={submitted}
              val={formState?.website}
            />

            <InputForm
              type="textarea"
              changeInput={onInputChange}
              label="bio"
              name="bio"
              val={formState?.bio}
              submitted={submitted}
              extraText={
                <small>
                  Provide your personal information, even if the account is used
                  for a business, a pet or something else.
                  <br /> This won't be a part of your public profile.
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
              submitted={submitted}
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
              submitted={submitted}
            />
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
              className="change__prof__pic mt-3"
              onClick={(x) => onDeleteAccount(x)}
            >
              Permanently delete my account
            </span>
          </div>
        </form>
      </div>
    </Auxiliary>
  );
};

export default withRouter(EditProfileOption);
