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
      progressBarPercentage: 0,
      uploading: false,
      postingPhase: true,
      contentType: "",
      contentURL: "",
      contentName: "",
      location: "",
      method: "Post",
      submitted: false
    };
    this._isMounted = false;
  }
  static contextType = AppContext;
  componentDidMount = () => {
    this._isMounted = true;
    if (this._isMounted) {
      this.context.changeMainState("currentPage", "New Post");
      this.setState({
        ...this.state,
        postingPhase: true,
      });
    }
  };
  componentWillUnmount = () => {
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

  // generateNewId = () => {
  //   let char1 = "G";
  //   let char2 = "j";
  //   let char3 = "k";
  //   let char4 = "M";
  //   let char5 = "N";
  //   let char6 = "Z";
  //   var charRandom = () => {
  //     return Math.floor(Math.random() * 6 + 1);
  //   };
  //   for (let i = 0; i < 5; i++) {
  //     charRandom(); //calls the "charRandom" function repeatedly 6 time, each time a new character will be created.
  //     switch (
  //       charRandom() //determines which new char will be created for each variable
  //     ) {
  //       case 1:
  //         char1 = "A";
  //         break;
  //       case 2:
  //         char2 = "B";
  //         break;
  //       case 3:
  //         char3 = "C";
  //         break;
  //       case 4:
  //         char4 = "D";
  //         break;
  //       case 5:
  //         char5 = "E";
  //         break;
  //       default:
  //         char6 = "F";
  //     }
  //   }

  //   const numRandom = () => {
  //     return (
  //       char1 + char2 + char3 + Math.random() * 9999 + 1 + char4 + char5 + char6
  //     );
  //   };

  //   return numRandom();
  // };

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
                notify("Post has been added");
                this.props.history.push("/");
                this.resetState();
                this.setState(updateObject(this.state, {submitted: false}));
              }).catch(() =>{
                notify("Failed to make a post. Please try again later!", "error");
              });              
            } else {
              notify("Content should be inserted", "error");
            }
          } else {
            notify("Caption should be between 2 and 250 characters", "error");
          }
      } else if(this.state.method.toLowerCase() === Consts.Reel) {
        //submits reel
        const addedReel = {
          id: generateNewId(),
          comments: [],
          contentURL: this.state.contentURL,
          date: new Date(),
          likes: [],
          userName: receivedData?.userName,
          postOwnerId: uid,
          userAvatarUrl: receivedData?.userAvatarUrl,
          contentName: this.state.contentName,
        }
        addPost(addedReel, Consts.Reel).then(() => {
          notify("Reel has been added.");
          this.props.history.goBack();
          this.resetState();
          this.setState(updateObject(this.state, {submitted: false}));
        }).catch(() =>{
          notify("Failed to post reel. Please try again later!", "error");
        });
      }
      
    }
  }
  handleFileChange = (w) => {
    const { receivedData, notify } = this.context;
    let uploadedItem = w[0];
    const fileName = `${Math.random()}${uploadedItem.name}`;
    const metadata = {
      contentType: uploadedItem !== "" ? uploadedItem?.type : null,
    };
    //post
    if(this.state.method.toLowerCase() === Consts.Post){
      if (
            /(image|video)/g.test(metadata.contentType) &&
            uploadedItem.size <= 12378523
          ) {
            const itemType = /image/g.test(metadata.contentType) ? "image" : "video";
            if (uploadedItem.name.split("").length <= 50) {
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
                    })
                    .catch((err) => {
                      notify(err, "error");
                    });
                }
              );
            } else {
              notify(
                `The name of the ${itemType} is too long. it should not exceed 50 characters`,
                "info"
              );
            }
          } else {
            notify(
              "Please choose an image or video that doesn't exceed the size of 12MB.",
              "info"
            );
          }
    }else if(this.state.method.toLowerCase() === Consts.Reel) {
      //reel
      if (
        /video/g.test(metadata.contentType) &&
        uploadedItem.size <= 12378523
      ) {
        if (uploadedItem.name.split("").length <= 50) {
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
                })
                .catch((err) => {
                  notify(err, "error");
                });
            }
          );
        } else {
          notify(
            `The name of the video is too long. it should not exceed 50 characters`,
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
    
  };
  onInputChange =(val, name) => {
    this.setState(updateObject(this.state,{[name]: val}))
  }
  render() {
    const isValid = this.state.method.toLowerCase() === Consts.Post ? this.state.caption && this.state.location && this.state.contentType : this.state.method.toLowerCase() === Consts.Reel? this.state.contentType : null;
    const {notify } = this.context;
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
                    <h4>Uploading...</h4>
                    <Skeleton count={1} width={250} height={250} />
                  </div>
                ) :  this.state.contentType ? 
                (<div>
                  {
                    this.state.contentType === "image" ?
                    <img src={this.state.contentURL} alt="" />
                    : this.state.contentType === "video" ? 
                   <video src={this.state.contentURL} controls > </video>
                     : null
                  }  
                  {
                    this.state.method.toLowerCase() === Consts.Post ?
                  <div className="mt-2">        
                          <InputForm
                              required={true}
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
                  : null  
                  }
              
                </div>)
               : this.state.contentType === "" ? (
                    <div>
                      <Files
                          className="files__dropzone"
                          accepts={this.state.method.toLowerCase() === Consts.Post? ['image/*','video/*'] : this.state.method.toLowerCase() === Consts.Reel ?  ['video/*'] : null}
                          maxFileSize={12378523}
                          minFileSize={0}
                          clickable
                          onChange={(w) => this.handleFileChange(w)}
                          multiple={false}
                          maxFiles={1}
                          onError={(error)=> notify(error.message, "error")}
                          dragActiveClassName="files-dropzone-active"
                        >  {`${this.state.method.toLowerCase() === Consts.Post ? "Drop an image or video here to upload " : this.state.method.toLowerCase() === Consts.Reel ?  "Drop a video here to upload" : "Drop a file here or click to upload"}`}</Files>
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
                          <Button disabled={!isValid} type="submit" value="Post" variant="contained" color="primary">
                            Post
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
