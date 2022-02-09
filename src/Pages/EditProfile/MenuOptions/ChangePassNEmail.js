import React, { useContext, useState, useRef, useEffect } from "react";
import Auxiliary from "../../../Components/HOC/Auxiliary";
import { AppContext } from "../../../Context";
import InputForm from "../../../Components/Generic/InpuForm/InputForm";
import { auth } from "../../../Config/firebase";
import firebase from "firebase";
import { Avatar } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { GoVerified } from "react-icons/go";

const ChangePassNEmail = (props) => {
  const {
    receivedData,
    currentUser,
    notify,
    confirmPrompt,
    returnPassword,
  } = useContext(AppContext);
  //ref(s)
  const _isMounted = useRef(true);
  //useEffect
  useEffect(() => () => _isMounted.current= false, []);
  //useState
  const [formState, setForm] = useState({
    email: {
      regexRules: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      value: currentUser?.email,
    },
    oldPassword: { regexRules: /a[^]*Z/, value: "" },
    newPassword: {
      regexRules: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,20}$/,
      value: "",
    },
    confirmPassword: {
      regexRules: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,20}$/,
      value: "",
    },
    modalPassword: { regexRules: /a[^]*Z/, value: "" },
    modalEmail: { regexRules: /a[^]*Z/, value: "" },
  });
  const [isSubmitted, setSubmission] = useState({
    passwordForm: false,
    emailForm: false,
    modalForm: false,
    forgetPassForm: false,
  });
  const [openModal, setModal] = useState({
    passModal: false,
    emailModal: false,
  });
  const onInputChange = (val, name) =>
    setForm({ ...formState, [name]: { ...formState[name], value: val } });

  const onSubmission = (event, formType) => {
    event.preventDefault();

    if (formType === "email") {
      setSubmission({ ...isSubmitted, emailForm: true });
      setModal({ ...openModal, passModal: true });
    } else if (formType === "password") {
      setSubmission({ ...isSubmitted, passwordForm: true });
      const extractPass = localStorage.getItem("user");
      if (extractPass) {
        const savedPass = returnPassword(JSON.parse(extractPass).password);
        if (formState?.oldPassword.value === savedPass) {
          if (
            formState?.newPassword.value &&
            formState?.newPassword.regexRules.test(formState?.newPassword.value)
          ) {
            if (
              formState?.newPassword.value === formState?.confirmPassword?.value
            ) {
              const credential = firebase.auth.EmailAuthProvider.credential(
                currentUser?.email,
                savedPass
              );
              auth.currentUser
                .reauthenticateAndRetrieveDataWithCredential(credential)
                .then(() => {
                  if(_isMounted?.current){
                      auth.currentUser
                      .updatePassword(formState?.newPassword.value)
                      .then(() => {
                        if(_isMounted?.current){
                           notify("Password updated successfully", "success");
                        }
                      })
                      .catch((error) => {
                        if(_isMounted?.current){
                          notify(
                            error || "An error occurred. Try again later!",
                            "error"
                          );
                        }
                       
                      });
                    setSubmission({ ...isSubmitted, passwordForm: false }); 
                  }
                
                })
                .catch(() => {
                  if(_isMounted?.current){
                    notify("An error occurred.", "error");
                  }
                });
            } else {
              notify(
                "The confirm password you entered does not match the new password.",
                "error"
              );
            }
          } else {
            notify(
              "Please type a valid new password. A valid password should be between 8 to 20 characters, contains at least one number, one lowecase letter and one uppercase letter.",
              "error"
            );
          }
        } else {
          notify(
            "The old password you entered is not correct. Please type the correct password.",
            "error"
          );
        }
      } else {
        props.history.push("/auth");
      }
    }
  };
  const verifyEmail = () => {
    const buttons = [
      {
        label: "Cancel",
      },
      {
        label: "Confirm",
        onClick: () => {
          auth.currentUser
            .sendEmailVerification()
            .then(() => {
              if(_isMounted?.current){
              notify(
                  "Verification message sent successfully. Please check your email",
                  "success"
                );
              }
            })
            .catch((err) => {
              if(_isMounted?.current){
                 notify(err || "An error occurred. Try again later!", "error");
              }
            });
        },
      },
    ];
    confirmPrompt("Confirmation", buttons, "Verify Email?");
  };
  const onConfirmation = (type) => {
    setSubmission({ ...isSubmitted, emailForm: false });
    if (type === "password") {
      setSubmission({ ...isSubmitted, modalForm: true });
      const credentials = firebase.auth.EmailAuthProvider.credential(
        currentUser?.email,
        formState?.modalPassword.value
      );
      auth.currentUser
        .reauthenticateAndRetrieveDataWithCredential(credentials)
        .then(() => {
          if(_isMounted?.current){
            auth.currentUser
              .updateEmail(formState?.email.value)
              .then(() => {
                if(_isMounted?.current){
                    notify("Email updated successfully", "success");
                    setModal({ ...openModal, passModal: false });
                    setSubmission({ ...isSubmitted, modalForm: false });
                }
              })
              .catch(() => {
                if(_isMounted?.current){
                  notify(
                    "Failed to update email. Please try again later!",
                    "error"
                  );
                }
              });
          }
        })
        .catch(() => {
          if(_isMounted?.current){
             notify("The password you entered is not correct.", "error");
          }
        });
    } else if (type === "email") {
      setSubmission({ ...isSubmitted, forgetPassForm: false });
      auth
        .sendPasswordResetEmail(formState?.modalEmail?.value)
        .then(() => {
          if(_isMounted?.current){
            notify(
              "A password reset config has been send to your email",
              "success"
            );
            setModal({ ...openModal, emailModal: false });
            setSubmission({ ...isSubmitted, forgetPassForm: false });
          }

        })
        .catch((err) => {
          if(_isMounted?.current){
            notify(
              `The email you entered does not exist in our database" ${err}`,
              "error"
            );
          }
        });
    }
  };
  return (
    <Auxiliary>
      <div className="option--container fadeEffect">
        <div className="flex-row change--photo mb-3">
          <Avatar
            className="user__picture mr-4"
            alt={receivedData?.userName}
            src={receivedData?.userAvatarUrl}
          />
          <div>
             <h1 className="user__prof__name">{receivedData?.userName} {receivedData?.isVerified && <span><GoVerified className="verified_icon"/></span>}</h1>
          </div>
        </div>

        {/* Modals */}
        <Modal
          show={openModal?.passModal}
          animation={true}
          onHide={() => setModal({ ...openModal, passModal: false })}
        >
          <Modal.Header>
            <Modal.Title>Enter Password to continue</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <InputForm
                type="text"
                inputType="password"
                name="modalPassword"
                label="password"
                changeInput={onInputChange}
                submitted={isSubmitted?.modalForm}
                val={formState?.modalPassword.value}
              />
            </form>
          </Modal.Body>
          <Modal.Footer>
            <div className="modal--btns flex-row">
              <Button
                variant="secondary"
                className="mr-3"
                onClick={() => setModal({ ...openModal, passModal: false })}
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => onConfirmation("password")}
              >
                Confirm
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
        <Modal
          show={openModal?.emailModal}
          animation={true}
          onHide={() => setModal({ ...openModal, emailModal: false })}
        >
          <Modal.Header>
            <Modal.Title>Enter your email to continue</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <InputForm
                type="email"
                name="modalEmail"
                label="email"
                changeInput={onInputChange}
                submitted={isSubmitted?.forgetPassForm}
                val={formState?.modalEmail.value}
              />
            </form>
          </Modal.Body>
          <Modal.Footer>
            <div className="modal--btns flex-row">
              <Button
                variant="secondary"
                className="mr-3"
                onClick={() => setModal({ ...openModal, emailModal: false })}
              >
                Close
              </Button>
              <Button variant="primary" onClick={() => onConfirmation("email")}>
                Send login link
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
        {/* email form */}
        <form className="mb-4" onSubmit={(k) => onSubmission(k, "email")}>
          <InputForm
            type="text"
            label="email"
            name="email"
            changeInput={onInputChange}
            submitted={isSubmitted?.emailForm}
            val={formState?.email.value}
          />
          <div className="form--btns flex-row">
            <input
              type="submit"
              disabled={
                !formState?.email.regexRules.test(formState?.email.value) ||
                formState?.email.value === currentUser?.email
              }
              className={
                !formState?.email.regexRules?.test(formState?.email.value) ||
                formState?.email.value === currentUser?.email
                  ? "disabled profile__btn primary__btn "
                  : "profile__btn primary__btn"
              }
              value="Change Email"
            />
           {
             !currentUser?.emailVerified && 
             <span
              onClick={() => verifyEmail()}
              className="change__prof__pic"
            >
              Verify Email
            </span>
           }
          </div>
        </form>
        {/* Password form */}
        <form onSubmit={(p) => onSubmission(p, "password")}>
          <InputForm
            type="text"
            inputType="password"
            label="old password"
            name="oldPassword"
            submitted={isSubmitted?.passwordForm}
            changeInput={onInputChange}
            val={formState?.oldPassword.value}
          />
          <InputForm
            type="text"
            inputType="password"
            label="new password"
            name="newPassword"
            changeInput={onInputChange}
            submitted={isSubmitted?.passwordForm}
            val={formState?.newPassword.value}
          />
          <InputForm
            type="text"
            inputType="password"
            label="confirm new password"
            name="confirmPassword"
            changeInput={onInputChange}
            submitted={isSubmitted?.passwordForm}
            val={formState?.confirmPassword.value}
          />
          <div className="form--btns flex-row">
            <input
              disabled={
                !formState?.oldPassword.value ||
                !formState?.newPassword.value ||
                !formState?.confirmPassword.value
              }
              className={
                !formState?.oldPassword.value ||
                !formState?.newPassword.value ||
                !formState?.confirmPassword.value
                  ? "disabled profile__btn primary__btn"
                  : "profile__btn primary__btn"
              }
              type="submit"
              value="Change Password"
            />
            <span
              onClick={() => setModal({ ...openModal, emailModal: true })}
              className="change__prof__pic"
            >
              Forgot password?
            </span>
          </div>
        </form>
      </div>
    </Auxiliary>
  );
};

export default withRouter(ChangePassNEmail);
