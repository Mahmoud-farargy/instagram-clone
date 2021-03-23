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

const InputForm = lazy(() =>
  import("../../../Components/Generic/InpuForm/InputForm")
);

const ProfessionalAccount = (props) => {
  const { receivedData, handleEditingProfile, notify } = useContext(AppContext);
  //useState
  const [formState, setForm] = useState({
    professionalAcc: { category: "", show: false },
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
            <InputForm
              type="checkbox"
              changeInput={onInputChange}
              label="show"
              name="show"
              labelText="Show category on profile"
              submitted={formState?.submitted}
              val={formState?.professionalAcc?.show}
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
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default withRouter(ProfessionalAccount);
