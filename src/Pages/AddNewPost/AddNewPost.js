import React, { PureComponent, Fragment } from "react";
import { storage } from "../../Config/firebase";
import { AppContext } from "../../Context";
import "./AddNewPost.css";
import { withRouter } from "react-router-dom";
import { Button, LinearProgress } from "@material-ui/core";
import Skeleton from "react-loading-skeleton";
import InputForm from "../../Components/Generic/InpuForm/InputForm";
import {updateObject} from "../../Utilities/Utility";
import Files from "react-files";
import * as Consts from "../../Utilities/Consts";
class AddNewPost extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      posts: [
        {
          caption: "",
          id: "",
          contentType: "",
          contentURL: "",
          comments: [],
          date: "",
          likes: [],
          userName: "",
          location: "",
          uid: "",
        },
      ],
      caption: "",
      selectedReelGroup: "New Group",
      newGroupName: "",
      progressBarPercentage: 0,
      uploading: false,
      postingPhase: true,
      contentType: "",
      contentURL: "",
      contentName: "",
      location: "",
      method: "Post",
      submitted: false,
      showReelFieldErr: false,
    };
    this._isMounted = true;
  }
  static contextType = AppContext;
  componentDidMount = () => {
    if (this._isMounted) {
      const { changeMainState, receivedData } = this.context;
      changeMainState("currentPage", "Add New");
      this.setState({
        ...this.state,
        postingPhase: true, 
        selectedReelGroup: receivedData?.reels && (receivedData?.reels?.length > 0 ? (receivedData?.reels[0].groupName) :"New Group"),
      });
    }
  };
  componentWillUnmount = () => {
    //if content is uploaded and not committed, then delete it from FB
    if(this.state.contentName && this.state.contentURL){
      this.context.deleteContentFromFB(this.state.contentName, this.state.method.toLowerCase() === Consts.Post ? "content" : "reels");
    }
    this._isMounted = false;
  };
  componentDidUpdate = () => {
    const { receivedData } = this.context;
    if (receivedData?.posts !== this.state.posts) {
      this.setState({
        ...this.state,
        posts: receivedData?.posts,
      });
    }
  };

  resetState() {
    this.setState({
      ...this.state,
      caption: "",
      progressBarPercentage: 0,
      uploading: false,
      postingPhase: false,
      contentType: "",
      contentURL: "",
      location: "",
      contentName: "",
      showReelFieldErr: false
    });
  }

  onCancel() {
    this.context.deleteContentFromFB(this.state.contentName, this.state.method.toLowerCase() === Consts.Post ? "content" : "reels");
    this.resetState();
  }
  onSubmitPost(x) {
    x.preventDefault();
    this.setState(updateObject(this.state, {submitted: true}));
    let { receivedData, uid, notify, generateNewId, addPost } = this.context;

    if (uid) {
      //submits post
      if(this.state.method.toLowerCase() === Consts.Post){
         if (this.state.caption.split(" ").length < 250 && this.state.caption.split(" ").length > 0) {
            if (this.state.contentName !== "") {
              const addedPost = {
                caption: this.state.caption,
                id: generateNewId(),
                contentType: this.state.contentType,
                contentURL: this.state.contentURL,
                comments: [],
                date: new Date(),
                likes: { people: [] },
                userName: receivedData?.userName,
                location: this.state.location,
                postOwnerId: uid,
                userAvatarUrl: receivedData?.userAvatarUrl,
                contentName: this.state.contentName,
              }
              addPost(addedPost, Consts.Post).then(() => {
                if(this._isMounted){
                  notify("Post has been added");
                  this.resetState();
                  this.setState(updateObject(this.state, {submitted: false}));
                  this.props.history.push("/");
                }
              }).catch(() =>{
                if(this._isMounted){
                  notify("Failed to make a post. Please try again later!", "error");
                }
              });              
            } else {
              notify("Content should be inserted", "error");
            }
          } else {
            notify("Caption should be between 2 and 250 characters", "error");
          }
      } else if(this.state.method.toLowerCase() === Consts.Reel) {
        //submits reel
        if(this.state.selectedReelGroup && (this.state.selectedReelGroup.toLowerCase() === "new group" ? this.state.newGroupName : true)){
          if(this.state.newGroupName.toLowerCase() !== "new group"){
              if(this.state.newGroupName?.split("").length <= 25){
                  if(receivedData?.reels && (receivedData?.reels.length > 0 ? (receivedData?.reels?.some(K => K.groupName.toLowerCase() !== this.state.newGroupName.toLowerCase())) : true)){
                    const addedReel = {
                      id: generateNewId(),
                      comments: [],
                      contentURL: this.state.contentURL,
                      date: new Date(),
                      likes: [],
                      userName: receivedData?.userName,
                      reelOwnerId: uid,
                      userAvatarUrl: receivedData?.userAvatarUrl,
                      contentName: this.state.contentName,
                    }
                    addPost(addedReel, Consts.Reel, {selectedGroup:this.state.selectedReelGroup, newGroupName: this.state.newGroupName}).then(() => {
                      if(this._isMounted){
                        notify(`Reel has been added to ${this.state.selectedReelGroup.toLowerCase() === "new group" ? this.state.newGroupName : this.state.selectedReelGroup}.`);
                        this.resetState();
                        this.setState(updateObject(this.state, {submitted: false}));
                        this.props.history.push("/profile");
                      }
                    }).catch((err) =>{
                      if(this._isMounted){
                        notify((err?.message || "Failed to post reel. Please try again later!"), "error");
                      }
                    });
                }else{
                  notify("This group name is aleady exit. Please choose another name.", "error");
                } 
              }else{
                notify("Group name should not exceed 25 characters.", "error");
              }
           
          }else{
            notify(`Can't accept the group name you entered. "New Group" is a reserved word that can't be used. Please choose another name!`, "error");
          }
          
        }else{
          this.setState({
            ...this.state,
            showReelFieldErr: true
          })
        }
       
      }
      
    }
  }
  handleFileChange = (w) => {
    const { receivedData, notify } = this.context;
    let uploadedItem = w[0];
    const fileName = `${Math.random()}${uploadedItem?.name}`;
    const metadata = {
      contentType: uploadedItem !== "" ? uploadedItem?.type : "",
    };
    const itemType = /image/g.test(metadata.contentType) ? "image": /video/g.test(metadata.contentType) ? "video" : "audio";
    if(receivedData?.uid){
        //post
        if(this.state.method.toLowerCase() === Consts.Post){
          if (
                /(image|video|audio)/g.test(metadata.contentType) &&
                uploadedItem.size <= 12378523
              ) {
                if (uploadedItem.name.split("").length < 300) {
                  const uploadContent = storage
                    .ref(`content/${receivedData?.uid}/${fileName}`)
                    .put(uploadedItem, metadata);
                  uploadContent.on(
                    "state_changed",
                    (snapshot) => {
                      //Progress function ..
                      const progress =
                        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                      this.setState({
                        ...this.state,
                        uploading: true,
                        progressBarPercentage: progress,
                      });
                    },
                    (error) => {
                      notify(error.message, "error");
                      this.resetState();
                    },
                    () => {
                        // Complete function..
                        storage
                          .ref(`content/${receivedData?.uid}`)
                          .child(fileName)
                          .getDownloadURL()
                          .then((url) => {
                            if(this._isMounted){
                              //post content on db
                              this.setState({
                                ...this.state,
                                contentName: fileName,
                                uploading: false,
                                progressBarPercentage: 0,
                                contentURL: url,
                                contentType: itemType,
                              });
                              uploadedItem = ""; 
                            }
                          })
                          .catch((err) => {
                            if(this._isMounted){
                                notify((err?.message|| `Failed to upload ${itemType}. Please try again later.`), "error");
                            }
                          });
                    }
                  );
                } else {
                  notify(
                    `The name of the ${itemType} is too long. it should not exceed 300 characters`,
                    "info"
                  );
                }
              } else {
                notify(
                  `The ${itemType} should should not exceed the size of 12MB.`,
                  "info"
                );
              }
        }else if(this.state.method.toLowerCase() === Consts.Reel) {
          //reel
          if (
            /video/g.test(metadata.contentType) &&
            uploadedItem.size <= 12378523
          ) {
            if (uploadedItem.name.split("").length <= 250) {
              const uploadContent = storage
                .ref(`reels/${receivedData?.uid}/${fileName}`)
                .put(uploadedItem, metadata);
              uploadContent.on(
                "state_changed",
                (snapshot) => {
                  //Progress function ..
                  const progress =
                    Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  this.setState({
                    ...this.state,
                    uploading: true,
                    progressBarPercentage: progress,
                  });
                },
                (error) => {
                  notify(error.message, "error");
                  this.resetState();
                },
                () => {
                  // Complete function..
                  storage
                    .ref(`reels/${receivedData?.uid}`)
                    .child(fileName)
                    .getDownloadURL()
                    .then((url) => {
                      if(this._isMounted){
                        //post content on db
                        this.setState({
                          ...this.state,
                          contentName: fileName,
                          uploading: false,
                          progressBarPercentage: 0,
                          contentURL: url,
                          contentType: "video",
                        });
                        uploadedItem = "";
                      }
                    })
                    .catch((err) => {
                      if(this._isMounted){
                          notify((err?.message|| `Failed to upload video. Please try again later.`), "error");
                      }
                    });
                }
              );
            } else {
              notify(
                `The name of the video is too long. it should not exceed 250 characters`,
                "info"
              );
            }
          } else {
            notify(
              "Please choose a video that doesn't exceed the size of 12MB.",
              "info"
            );
          }

        }
    }else{
      notify("You are not properly logged in. Please login and try again.","error");
      this.props.history.push("/auth");
    }    
  };
  onInputChange =(val, name) => {
    this.setState(updateObject(this.state,{[name]: val}));
    if(this.state.method.toLowerCase() === Consts.Reel){
      !this.state.selectedReelGroup && (this.setState({...this.state,selectedReelGroup: "New Group"}));
    }
  }
  render() {
    const isValid = this.state.method.toLowerCase() === Consts.Post ? this.state.caption && this.state.contentType : this.state.method.toLowerCase() === Consts.Reel? (this.state.contentType && (this.state.selectedReelGroup ||  this.state.newGroupName)) : null;
    const {notify, receivedData } = this.context;
    return (
      <Fragment>
        <section id="upload" className="post--uploading--container flex-column">
          <div className="desktop-comp post--uploading--inner flex-column">
            <h5 className="app__titles">Add a Post/ Reel</h5>
            <div className="post--uploading--card flex-column">
              <div className="showing--upladed--content">
                <div>
                  {this.state.uploading ? (
                  <div className="uploading__in__progress flex-column">
                    <h4 className="mb-3">{ this.state.progressBarPercentage <= 0 ? "Preparing..": this.state.progressBarPercentage >= 100 ?  "Processing..." : "Uploading.." }</h4>
                    <Skeleton count={1} width={250} height={250} />
                  </div>
                ) :  this.state.contentType ? 
                (<div>
                  {
                    this.state.contentType === "image" ?
                    <img loading="lazy" className="unselectable" src={this.state.contentURL} alt="" />
                    : this.state.contentType === "video" ? 
                    <video src={this.state.contentURL} controls > </video>
                    : this.state.contentType === "audio" ? 
                    <audio src={this.state.contentURL} controls > </audio>
                    : null
                  }  
                  {
                    this.state.method.toLowerCase() === Consts.Post ?
                  <div className="mt-2">        
                          <InputForm
                              required={true}
                              autoFocus={true}
                              type="textarea"
                              name="caption"
                              label="Enter a caption"
                              val={this.state.caption}
                              changeInput={this.onInputChange}
                              submitted={this.state.submitted}
                          />
                          <InputForm
                              type="text"
                              name="location"
                              label="location"
                              val={this.state.location}
                              changeInput={this.onInputChange}
                            />
                    </div>  
                  : this.state.method?.toLowerCase() === Consts.Reel ?
                  <div className="mt-2">
                    {
                      receivedData?.reels?.length > 0 &&
                      <InputForm
                            required={true}
                            type="select"
                            name="selectedReelGroup"
                            label="selected group"
                            options={[ "New Group",...receivedData?.reels?.map(s => s?.groupName)]}
                            val={this.state.selectedReelGroup}
                            changeInput={this.onInputChange}
                            submitted={this.state.submitted}
                      />
                    }  
                    {
                      ( receivedData?.reels?.length <= 0 || this.state.selectedReelGroup?.toLowerCase() === "new group") &&
                      <div>
                          <InputForm
                              required={true}
                              autoFocus={true}
                              type="text"
                              name="newGroupName"
                              label="Group Name"
                              val={this.state.newGroupName}
                              changeInput={this.onInputChange}
                              submitted={this.state.submitted}
                        /> 
                       
                      </div>
                    }
                    {
                      this.state.showReelFieldErr && this.state.selectedReelGroup?.toLowerCase() === "new group" && <small  className="text-align-center text-danger">Field above is required</small>
                    } 
                  </div>
                  :null  
                  }
              
                </div>)
               : this.state.contentType === "" ? (
                    <div>
                      <Files
                          className="files__dropzone"
                          accepts={this.state.method.toLowerCase() === Consts.Post? ['image/*','video/*','audio/*'] : this.state.method.toLowerCase() === Consts.Reel ?  ['video/*'] : null}
                          maxFileSize={12378523}
                          minFileSize={0}
                          clickable
                          onChange={(w) => this.handleFileChange(w)}
                          multiple={false}
                          maxFiles={1}
                          onError={(error)=> notify(error.message, "error")}
                          dragActiveClassName="files-dropzone-active"
                        >  {`${this.state.method.toLowerCase() === Consts.Post ? "Drop an image, video or audio here to upload " : this.state.method.toLowerCase() === Consts.Reel ?  "Drop here a video to upload" : "Drop a file here or click to upload"}`}
                        <br />
                        <p className="mt-2 text--size--2">(Should not exceed 12MB)</p>
                        </Files>
                      <InputForm
                          type="select"
                          options={["Post", "Reel"]}
                          val={this.state.method}
                          changeInput={this.onInputChange}
                          name="method"
                          label="Type"
                        />

                    </div>
                     
                ) : null
              
              }
                </div>
                
              </div>
              <form onSubmit={(x) => this.onSubmitPost(x)}>

                {this.state.uploading ? (
                  <div className="my-4">
                    <LinearProgress
                      variant="buffer"
                      value={this.state.progressBarPercentage}
                      valueBuffer={0}
                    />
                  </div>
                ) : null}


                      {!this.state.uploading ? (
                        <div>
                          
                          {this.state.contentType !== "" ? (
                            <Button
                              onClick={() => this.onCancel()}
                              variant="contained"
                              className="my-3"
                            >
                              Cancel
                            </Button>
                          ) : null}
                          <Button disabled={!isValid} className={`share--btn ${!isValid && "disabled"}`} type="submit" value="Post" >
                            Share
                          </Button>
                        </div>
                      ) : null}
 
             
                
              </form>
            </div>
          </div>
        </section>
      </Fragment>
    );
  }
}
export default withRouter(AddNewPost);
