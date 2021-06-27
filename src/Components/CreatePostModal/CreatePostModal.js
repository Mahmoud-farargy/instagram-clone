import React, { Fragment } from "react";
import AddNewPost from "../../Pages/AddNewPost/AddNewPost";
import "./CreatePostModal.scss";
import { IoIosArrowBack } from "react-icons/io";

const CreatePostModal = ({ closeCreateModal, currentPhase, setCurrentPhase }) => {
    const goBack = () => {
        currentPhase > 1 ? setCurrentPhase(currentPhase -1) : closeCreateModal();
    }
    return (
        <Fragment>
            <div id="createPost" >
                <div className="create--post--container modalShow">
                    <div className="create--post--inner">
                        <div className="create--post--header flex-row">
                            <div className="create--post--header--inner flex-row">
                                <span>
                                  {
                                    currentPhase > 0 &&
                                      <IoIosArrowBack className="go__back__icon" onClick={() => goBack()} />
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
                                       : "Create"
                                   }
                                </h1>
                                <span className="create--post--close" onClick={() => closeCreateModal()}>
                                    &times;
                                </span>
                            </div>
                        </div>
                        <AddNewPost currentPhase={currentPhase} setCurrentPhase={setCurrentPhase}/>
                    </div>
                </div>
            </div>
            
        </Fragment>
    )
}
export default CreatePostModal;