import React, { Fragment, useContext } from "react";
import AddNewPost from "../../Pages/AddNewPost/AddNewPost";
import "./CreatePostModal.scss";
import { AppContext } from "../../Context";
import { IoIosArrowBack } from "react-icons/io";

const CreatePostModal = ({ closeCreateModal, currentPhase, setCurrentPhase }) => {
    const { loadingState } = useContext(AppContext);
    const goBack = () => {
        currentPhase.index > 1 ? setCurrentPhase({index: currentPhase.index > 3 ? 0 :currentPhase.index -1, title: currentPhase.title}) : closeCreateModal();
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
                                    currentPhase.index > 0 &&
                                      <IoIosArrowBack className="go__back__icon" onClick={() => !loadingState.uploading && goBack()} />
                                  }
                                </span>
                                <h1>
                                   {
                                       currentPhase.index === 0 ?
                                        "New Post/Reel"
                                       : 
                                       currentPhase.index === 1 ?
                                         "Crop"
                                       :
                                       currentPhase.index === 2 ?
                                         "Filter"
                                       :
                                       currentPhase.index === 3 ?
                                         "Compose"
                                       : currentPhase.index >= 4 ?
                                            currentPhase.title
                                       : "Create"
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