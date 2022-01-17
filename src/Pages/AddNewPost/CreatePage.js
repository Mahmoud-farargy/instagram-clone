import React, { Fragment, useState } from "react";
import CreatePostModal from "../../Components/CreatePostModal/CreatePostModal";
import "./CreatePage.scss";
import { useHistory } from "react-router-dom";
import OptionsModal from "../../Components/Generic/OptionsModal/OptionsModal";
import PropTypes from "prop-types";

const CreatePage = (props) => {
  const { loadingState } = props;
    const history = useHistory();
    const [currentPhase, setCurrentPhase] = useState({index: 0, title: "post"});
    const [dismissModal, setDismissModal] = useState(false);
    const closeCreateModal = () => {
      if(!loadingState.uploading){
          currentPhase.index > 0 ? setDismissModal(true): history.goBack();
      }
    }
    return (
        <Fragment>
          {/* Modals */}
            {
                dismissModal &&
                <div className="create--dismiss--modal">
                  <OptionsModal closeModalFunc={(k) => setDismissModal(k)} >
                       <div className="uf--box--inner">
                          <h3>Discard Post?</h3>
                          <p>If you leave now, you will lose any changes you've made.</p>
                      </div>
                      <span className="text-danger font-weight-bold"
                        onClick={() => history.goBack()}
                      >
                        Discard
                      </span>
                      <span >
                        Cancel
                      </span>
                    </OptionsModal>
                    <div
                      style={{
                        opacity: "1" ,
                        display: "block",
                        transition: "all 0.5s linear",
                      }}
                      className="backdrop"
                      onClick={() => setDismissModal(false)}
                    />
                </div>
            }
            {/* --xx-- Modal(s) --xx-- */}
            <div id="createPage">

                <CreatePostModal closeCreateModal={closeCreateModal} setCurrentPhase={setCurrentPhase} currentPhase={currentPhase} />
                <div
                style={{
                  opacity: "1" ,
                  display: "block",
                  transition: "all 0.5s linear",
                }}
                className="backdrop"
                onClick={() => closeCreateModal()}
              ></div> 
            </div>
        </Fragment>
    )
}
CreatePage.propTypes ={
  loadingState: PropTypes.object.isRequired
}
export default CreatePage;