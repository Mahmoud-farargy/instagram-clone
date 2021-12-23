import React, { Fragment, useContext } from "react";
import AddNewPost from "../../Pages/AddNewPost/AddNewPost";
import "./CreatePostModal.scss";
import { AppContext } from "../../Context";
import { IoIosArrowBack } from "react-icons/io";

const CreatePostModal = ({ closeCreateModal, currentPhase, setCurrentPhase }) => {
    const { loadingState } = useContext(AppContext);
    const goBack = () => {
        currentPhase > 1 ? setCurrentPhase(currentPhase === 4 ? 0 :currentPhase -1) : closeCreateModal();
    }
    return (
        <Fragment>
            <div id="createPost" >
                <div className="create--post--container modalShow">
                    <div className="create--post--inner">
                        {/* Header */}
                        <div className="create--post--header flex-row">
                            <div className="create--post--header--inner flex-row">
                                <span className={loadingState.uploading ? "disabled" : ""}>
                                  {
                                    currentPhase > 0 &&
                                      <IoIosArrowBack className="go__back__icon" onClick={() => !loadingState.uploading && goBack()} />
                                  }
                                </span>
                                <h1>
                                   {
                                       currentPhase === 0 ?
                                        "New Post/Reel"
                                       : 
                                       currentPhase === 1 ?
                                         "Crop"
                                       :
                                       currentPhase === 2 ?
                                         "Filter"
                                       :
                                       currentPhase === 3 ?
                                          "Compose"
                                       : currentPhase === 4 ?
                                          "Tweet"
                                       :  "Create"
                                   }
                                </h1>
                                <div>
                                    <span className={`create--post--close ${loadingState.uploading ? "disabled" : ""}` } onClick={() => !loadingState.uploading && closeCreateModal()}>
                                        &times;
                                    </span>  
                                </div>
                            </div>
                        </div>
                        {/* Body */}
                        <AddNewPost currentPhase={currentPhase} setCurrentPhase={setCurrentPhase}/>
                    </div>
                </div>
            </div>
            
        </Fragment>
    )
}
export default CreatePostModal;