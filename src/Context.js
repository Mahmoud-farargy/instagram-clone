import React, { PureComponent } from "react";
import { db, auth, storageRef } from "./Config/firebase";
import igVideoImg from "./Assets/instagram-video.png";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import * as Consts from "./Utilities/Consts";
import { updateObject } from "./Utilities/Utility";
const AppContext = React.createContext();

class AppProvider extends PureComponent {
  //For termporary memory
  constructor(props) {
    super(props);
    this.state = {
      receivedData: {},
      uid: "",
      currentUser: {},
      suggestionsList: [],
      initialSuggestions: [],
      isUserOnline: false,
      usersProfileData: [],
      currentPostIndex: 0,
      currentChatIndex: 0,
      usersModalList: [],
      igVideoImg: igVideoImg,
      modalsState: {comments: false, users: false, options: false, post: false},
      currentPage: "",
      searchInfo: { results: [], loading: false },
      reelsProfile: [],
    };
  }

  updatedReceivedData = () => {
    db.collection("users")
      .doc(this.state.uid)
      .onSnapshot((data) => {
        //any fetching overflow? change onSnapshot to get
        this.setState({
          ...this.state,
          receivedData: data.data(),
        });
      });
  };
  updateSuggestionsList(data) {
    let sugs = this.state.initialSuggestions;
    sugs.unshift(data);
    let suggestList = Array.from(
      new Set(sugs?.map((itemId) => itemId.uid))
    ).map((ID) => sugs?.find((el) => el.uid === ID));
    this.setState({
      ...this.state,
      suggestionsList: suggestList,
    });
  }
  updateParts = (
    uid,
    stateBase,
    newState,
    updateAbility,
    withNotifications
  ) => {
    if (withNotifications === "") {
    return new Promise((resolve, reject) => {
        db.collection("users")
          .doc(uid)
          .update({
            [stateBase]: newState,
          })
          .then(() => {
            if (updateAbility === true || uid === this.state.receivedData?.uid) {
              this.updatedReceivedData();
            }
            resolve();
          }).catch((err) =>{
            reject(err.message);
          });
     })
      
    } else {
      return new Promise((resolve, reject) =>{
          db.collection("users")
          .doc(uid)
          .update({
            [stateBase]: newState,
            notifications: withNotifications,
          })
          .then(() => {
            if (updateAbility === true || uid === this.state.receivedData?.uid) {
              this.updatedReceivedData();
            }
            resolve();
          }).catch((err) => {
            reject(err.message);
          });
      })
    }
  };

  handleMyLikes = (boolean, postIndex, uid, userName, userAvatarUrl) => {
    let dataCopy = JSON.parse(JSON.stringify(this.state.receivedData?.posts));
    var likesArr = dataCopy[postIndex].likes;
    function getPeopleIndex() {
      var currIndex;
      likesArr.people.find((item, i) => {
        currIndex = i;
        return item.id === uid;
      });
      return currIndex;
    }

    boolean
      ? likesArr.people.unshift({
          id: uid,
          userName: userName,
          userAvatarUrl: userAvatarUrl,
          date: new Date(),
        })
      : likesArr.people.splice(getPeopleIndex(), 1);
    likesArr.people = Array.from(
      new Set(likesArr.people.map((itemId) => itemId.id))
    ).map((myId) => likesArr.people.find((el) => el.id === myId));
    this.updateParts(uid, "posts", dataCopy, true, "");
  };

  handlePeopleLikes = (
    boolean,
    postIndex,
    postOwnerId,
    userName,
    userAvatarUrl,
    myId,
    contentURL,
    contentType
  ) => {
    db.collection("users")
      .doc(postOwnerId)
      .get()
      .then((items) => {
        const { posts = [], notifications = [], blockList = []} = items?.data();
        let unupdatedPosts = posts;
        let unupdatedNoti = notifications;

        let dataCopy = JSON.parse(JSON.stringify(unupdatedPosts));
        let notiCopy = JSON.parse(JSON.stringify(unupdatedNoti));
        const isBlocked = blockList.some(d => d.blockedUid === this.state.uid);
        var likesArr = dataCopy[postIndex].likes;
        function getPeopleIndex() {
          var currIndex;
          likesArr.people.find((item, i) => {
            currIndex = i;
            return item.id === myId;
          });
          return currIndex;
        }
        if(!isBlocked){
            if (boolean) {
            //handles notifications
            notiCopy.isUpdate = true;
            const generatedID = this.generateNewId();
            likesArr.people.unshift({
              id: myId,
              userName: userName,
              notiId: generatedID,
              userAvatarUrl: userAvatarUrl,
              date: new Date(),
            });
            notiCopy.list.unshift({
              uid: myId,
              userName: postOwnerId === myId ? "You" : userName,
              userAvatarUrl: userAvatarUrl,
              notiId: generatedID,
              date: new Date(),
              contentType,
              contentURL,
              type: "like",
              notiText: `liked your ${contentType} post`,
            });
          } else if (!boolean) {
            likesArr.people.splice(getPeopleIndex(), 1);
            const currentI = notiCopy.list
              ?.map((el) => {
                return el.notiId;
              })
              .indexOf(likesArr.people?.notiId);
            if (currentI !== -1) {
              notiCopy.list.splice(currentI, 1);
            } else {
              // this.notify("abort 151 error", "error");
            }
          }
        }else{
          this.notify("Liking this user is not allowed","error");
        }
        

        likesArr.people = Array.from(
          new Set(likesArr.people.map((itemId) => itemId.id))
        ).map((ID) => likesArr.people.find((el) => el.id === ID));

        notiCopy.list = Array.from(
          new Set(notiCopy.list.map((itemId) => itemId.uid))
        ).map((ID) => notiCopy.list.find((el) => el.uid === ID));

        this.updateParts(postOwnerId, "posts", dataCopy, false, notiCopy);
      });
  };

  resetAllData() {
    this.setState({
      ...this.state,
      receivedData: {},
      uid: "",
      suggestionsList: [],
      isUserOnline: false,
      usersProfileData: [],
      currentPostIndex: {},
    });
  }

  handleSubmittingComments(
    ownership,
    index,
    myId,
    userName,
    comment,
    userAvatarUrl,
    postDate,
    postId,
    ownerId,
    contentURL,
    contentType
  ) {
    //create an index checker here to make sure this is the correct post to edit
    const generatedCommentId = this.generateNewId();
    if (ownership === "mine") {
      let myPostsCopy = JSON.parse(
        JSON.stringify(this.state.receivedData.posts)
      );
      myPostsCopy[index].comments.push({
        comment: comment,
        uid: myId,
        userAvatarUrl: userAvatarUrl,
        userName: userName,
        postDate: new Date(),
        postId: postId,
        ownerId,
        likes: [],
        subComments: [],
        commentId: generatedCommentId
      });

      this.updateParts(myId, "posts", myPostsCopy, true, "");
    } else if (ownership === "others") {
      db.collection("users")
        .doc(ownerId)
        .get()
        .then((items) => {
          const {posts = [], notifications = [], blockList = []} = items?.data();
          let oldPosts = posts;
          let noti = notifications;
          let theirPostsCopy = JSON.parse(JSON.stringify(oldPosts));
          let notiCopy = JSON.parse(JSON.stringify(noti));
          const generatedID = this.generateNewId();
          
          const isBlocked = blockList.some(d => d.blockedUid === this.state.uid);
          if(!isBlocked){
              theirPostsCopy[index].comments.push({
              comment: comment,
              uid: myId,
              userAvatarUrl: userAvatarUrl,
              userName: userName,
              postDate: new Date(),
              postId: postId,
              ownerId: ownerId,
              likes: [],
              subComments: [],
              notiId: generatedID,
              commentId: generatedCommentId
            });
            notiCopy.isUpdate = true;
            notiCopy.list.push({
              uid: myId,
              userName: ownerId === myId ? "You" : userName,
              userAvatarUrl: this.state.receivedData?.userAvatarUrl,
              date: new Date(),
              notiId: generatedID,
              contentURL,
              contentType,
              notiText: `commented on your ${contentType} post: ${comment} `,
              type: "comment",
              commentId: generatedCommentId
            });

            this.updateParts(ownerId, "posts", theirPostsCopy, false, notiCopy);
          }else {
            this.notify("Submitting a comment to this user is not allowed", "error");
          }
          
        });
    }
  }

  deleteContentFromFB(path, root) {
    return new Promise((resolve, reject) => {
        path && storageRef.child(`${root}/${this.state.uid}/${path}`).delete().then(()=>{
          resolve();
        }).catch((err) =>{
          reject(err.message);
        });
    })
  }
  getUsersProfile(uid) {
    
    return new Promise((resolve, reject) => {
        db.collection("users")
        .doc(uid)
        .onSnapshot((snapshot) => {
          this.setState({
            ...this.state,
            usersProfileData: snapshot.data(),
          });
          resolve();
        }, (error) =>{
          reject(error);
        });
    });
  
  }
  updateUserState = (state) => {
    this.setState({
      ...this.state,
      isUserOnline: state,
    });
  };
  updateUID = (UID) => {
    this.setState({
      ...this.state,
      uid: UID,
    });
  };
  changeMainState = (property, newValue) => {
    this.setState({
      ...this.state,
      [property]: newValue,
    });
  };

  handleSubComments = (
    commentInfo,
    commentText,
    userAvatarUrl,
    updatingAbility,
    contentURL,
    contentType
  ) => {
    const { commentIndex, postIndex, postId, postOwnerId , senderUid } = commentInfo;
    db.collection("users")
      .doc(postOwnerId)
      .get()
      .then((items) => {
        const {posts= [],notifications = [], blockList = [] } = items?.data();
        let unupdatedPosts = posts;
        let noti = notifications;
        const postsCopy = JSON.parse(JSON.stringify(unupdatedPosts));
        const notiCopy = JSON.parse(JSON.stringify(noti));
        const isBlocked = blockList.some(g => g.blockedUid ===  this.state.uid);

        let matchedIndex = postsCopy
          .map((el) => {
            return el.id;
          })
          .indexOf(postId);
        if (postIndex === matchedIndex && matchedIndex !== -1) {
          if(!isBlocked){
              var notiId = this.generateNewId();
              var generateSubId = this.generateNewId();
              const subComments = postsCopy[postIndex].comments[commentIndex].subComments;
              subComments.push({
              commentText: commentText,
              postId: postId,
              postOwnerId: postOwnerId,
              senderName: this.state.receivedData?.userName,
              userAvatarUrl: userAvatarUrl,
              notiId: notiId,
              date: new Date(),
              likes: [],
              senderUid,
              subCommentId: generateSubId
            });
            if (postOwnerId !== this.state.uid) {
              notiCopy.isUpdate = true;
              notiCopy.list.push({
                uid: this.state.uid,
                userName:
                  postOwnerId === this.state.uid
                    ? "You"
                    : this.state.receivedData?.userName,
                notiId,
                contentURL,
                contentType,
                likes: [],
                userAvatarUrl: this.state.receivedData?.userAvatarUrl,
                date: new Date(),
                notiText: `mentioned you in a comment: ${commentText}`,
                type: "sub-comment",
                subCommentId: generateSubId
              });
            }
            this.updateParts(
              postOwnerId,
              "posts",
              postsCopy,
              updatingAbility,
              notiCopy
            );
          }else{
            this.notify("Submitting a comment to this user is not allowed","error");
          }
          
        } else {
          this.notify("Error has occurred. Please try again later.", "error");
        }
      });
  };

  closeNotificationAlert = (state) => {
    const notiCopy = JSON.parse(
      JSON.stringify(this.state.receivedData?.notifications)
    );
    notiCopy[state] = false;
    this.updateParts(this.state.uid, "notifications", notiCopy, true, "");
  };

  handleLikingComments = (
    type,
    boolean,
    postIndex,
    postOwnerId,
    userName,
    userAvatarUrl,
    myId,
    commentIndex,
    commentText,
    contentURL,
    contentType,
    subCommentIndex,
    subCommentId,
  ) => {
   //needs more organization
    db.collection("users")
      .doc(postOwnerId)
      .get()
      .then((items) => {
        const {posts = [], notifications = [], blockList = []} = items?.data();
        let unupdatedPosts = posts;
        let noti = notifications;
        let dataCopy = JSON.parse(JSON.stringify(unupdatedPosts));
        let notiCopy = JSON.parse(JSON.stringify(noti));
        const isBlocked = blockList.some(d => d.blockedUid === this.state.uid);

        var likesArr = dataCopy && dataCopy[postIndex].comments[commentIndex];
        var subCommentsCopy = dataCopy[postIndex].comments && dataCopy[postIndex].comments.length > 0 && likesArr.subComments;
        let savedSubIndex = subCommentsCopy && subCommentsCopy.length >0 && subCommentsCopy?.map((el) => el.subCommentId).indexOf(subCommentId);
        if (unupdatedPosts && likesArr) {
          if (boolean) {
            if(!isBlocked){
              let generatedID = this.generateNewId();
              if(type === "comment"){
                  //like
                  likesArr.likes && likesArr.likes.unshift({
                    id: myId,
                    userName: userName,
                    userAvatarUrl: userAvatarUrl,
                    notiId: generatedID,
                    date: new Date(),
                    likeId: this.generateNewId(),
                  });
                 
              }else if(type === "subComment"){ 
                if(subCommentIndex === savedSubIndex && savedSubIndex !== -1){
                    subCommentsCopy[savedSubIndex].likes && subCommentsCopy[savedSubIndex].likes.unshift({
                      id: myId,
                      userName: userName,
                      userAvatarUrl: userAvatarUrl,
                      notiId: generatedID,
                      date: new Date(),
                      likeId: this.generateNewId(),
                  });
                
                  notiCopy.isUpdate = true;
                  notiCopy.list && notiCopy.list.unshift({
                        uid: myId,
                        notiId: generatedID,
                        userName: postOwnerId === myId ? "You" : userName,
                        date: new Date(),
                        userAvatarUrl: this.state.receivedData?.userAvatarUrl,
                        notiText: `liked your comment: ${commentText}`,
                        type: "like-comment",
                        contentURL,
                        contentType,
                  });
                }else{
                  this.notify("An error occurred","error");
                }
              }
              
            }else{
              this.notify("Liking this user is not allowed","error");
            }
           
          } else if(!boolean){
            const savedPosts = this.state.usersProfileData && this.state.usersProfileData?.posts && this.state.usersProfileData?.posts.length > 0 && this.state.usersProfileData?.posts[postIndex]?.comments;
            //dislike
            if(type === "comment"){
                let index = likesArr.likes
                  ?.map((el) => {
                    return el.id; //<<find a better way (don't use uid here)
                  })
                  .indexOf(myId);
                if (index !== -1) {
                  let notiIndex = notiCopy.list
                    ?.map((el) => { 
                      return el.notiId;
                    })
                    .indexOf(savedPosts && savedPosts[commentIndex]?.likes[index]?.notiId);
                  if (notiIndex !== -1) {
                    notiCopy.list.splice(notiIndex, 1); //<<< FIX THIS
                  } else {
                    // this.notify("error likes 304", "error");
                  }
                  likesArr.likes.splice(index, 1);
                } else {
                  this.notify("context 524 err", "error");
                }
            }else if(type === "subComment"){
              if(subCommentsCopy[savedSubIndex] && subCommentsCopy.length > 0){
                      let indexToDelete = subCommentsCopy[savedSubIndex].likes
                      ?.map((el) => { //<<find a better way (don't use uid here)
                        return el.id;
                      })
                      .indexOf(myId);
                    if (subCommentIndex === savedSubIndex && savedSubIndex !== -1 && indexToDelete !== -1) {
                      let notiIndex = notiCopy.list
                        ?.map((el) => {
                          return el.notiId;
                        })
                        .indexOf(savedPosts && savedPosts[commentIndex].subComments && savedPosts[commentIndex]?.subComments[savedSubIndex]?.likes[indexToDelete]?.notiId);
                      if (notiIndex !== -1) {
                        notiCopy.list.splice(notiIndex, 1); //<<< FIX THIS
                      } else {
                        // this.notify("error likes 304", "error");
                      }

                      subCommentsCopy[savedSubIndex] && subCommentsCopy[savedSubIndex].likes.length > 0 && subCommentsCopy[savedSubIndex].likes.splice(indexToDelete, 1);
                    } else {
                      this.notify("context 545 err", "error");
                    }
              }
              
            }
            
          }
          if(likesArr && likesArr.likes.length > 0){
            likesArr.likes = Array.from(
              new Set(likesArr.likes.map((itemId) => itemId.id))
            ).map((ID) => likesArr.likes.find((el) => el.id === ID));
          }

          if(subCommentsCopy && subCommentsCopy[savedSubIndex] && subCommentId && subCommentsCopy[savedSubIndex].likes){
             subCommentsCopy[savedSubIndex].likes = Array.from(
              new Set(subCommentsCopy[savedSubIndex].likes.map((itemId) => itemId.id))
            ).map((ID) => subCommentsCopy[savedSubIndex].likes.find((el) => el.id === ID));
          }
         

          this.updateParts(postOwnerId, "posts", dataCopy, false, notiCopy);
        }
      });
  };
  authLogout(history) {
    auth.signOut().then(() => {
      localStorage.clear();
      this.resetAllData();
    });
    history.replace("/auth");
  }
  handleFollowing(
    state,
    receiverUid,
    receiverName,
    receiverAvatarUrl,
    senderUid,
    senderName,
    senderAvatarUrl
  ) {
    if(receiverUid){
    db.collection("users")
      .doc(receiverUid)
      .get()
      .then((items) => {
        if(items){
          const {notifications = [], blockList = []} = items?.data();
            var unupdatedReceiversData = items.data()?.followers; //receiver's data
            var unupdatedSendersData = this.state.receivedData?.following; //sender's data
            var noti = notifications;
            let receiversCopy = JSON.parse(JSON.stringify(unupdatedReceiversData)); //creates a copy for each user's data
            let sendersCopy = JSON.parse(JSON.stringify(unupdatedSendersData));
            let notiCopy = JSON.parse(JSON.stringify(noti));
            // const follow = this.state.receivedData?.following.some(m => m.receiverUid === receiverUid);
            const isBlocked = blockList.some(g => g.blockedUid ===  this.state.uid);
            const blockedThem = this.state.receivedData?.blockList.some(g => g.blockedUid ===  receiverUid);
            if(!blockedThem){
                if (!state) {
                //follow
                // pushes sender's data into followers receiver's array

                if (receiverUid !== senderUid ) {
                  if(!isBlocked){
                        //makes sure the user somehow doesn't follow themselves
                      const generatedID = this.generateNewId();

                      receiversCopy.unshift({
                        senderUid,
                        senderName,
                        senderAvatarUrl,
                        notiId: generatedID,
                        date: new Date(),
                      });
                      let newReceiversCopy = Array.from(
                        new Set(receiversCopy.map((item) => item.senderUid))
                      ).map((id) => {
                        return receiversCopy.find((el) => el.senderUid === id);
                      }); //removes duplicates
                      notiCopy.isUpdate = true; //adds a notification
                      if(notiCopy.list){
                        notiCopy.list.unshift({
                          notiId: generatedID,
                          userName: senderName,
                          uid: senderUid,
                          date: new Date(),
                          type: "follow",
                          userAvatarUrl: senderAvatarUrl,
                          notiText: `started following you`,
                        });
                        
                          this.updateParts( receiverUid, "followers", newReceiversCopy, false, notiCopy);
                      }
                    

                      // pushes receiver's data into following sender's array
                      sendersCopy.unshift({
                        receiverUid,
                        receiverName,
                        receiverAvatarUrl,
                        date: new Date(),
                      });
                      let newSendersCopy = Array.from(
                        new Set(sendersCopy.map((item) => item.receiverUid))
                      ).map((id) => {
                        return sendersCopy.find((el) => el.receiverUid === id);
                      }); //removes duplicates

                    
                        this.updateParts(senderUid, "following", newSendersCopy, true, "");
                  } else {
                    this.notify("Following this user is not allowed.", "error");
                  }
                  
                } else {
                  this.notify("Following yourself is not allowed", "warning");
                }
              } else if (state) {
                //unfollow
                // removes sender from receiver's followers array
                //finds follower's index
                const currIndex = unupdatedReceiversData
                  ?.map((item) => {
                    return item.senderUid;
                  })
                  .indexOf(senderUid);
                //finds its notification's index

                if (currIndex !== -1) {
                  const notiIndex = notiCopy.list
                    ?.map((el) => {
                      return el.notiId;
                    })
                    .indexOf(unupdatedReceiversData[currIndex].notiId);

                  //removes follower
                  receiversCopy.splice(currIndex, 1);

                  //removes its notification
                  if (notiIndex !== -1) {
                    notiCopy.list.splice(notiIndex, 1);
                  } else {
                    // this.notify("Failed", "error");
                  }
                  //experimental
                  // notiCopy.list = Array.from(new Set(notiCopy.list.map((item) => item.uid))).map((id) => notiCopy.list.find((el) =>  el.type === "follow" ? el.uid === id : el));
                  // notiCopy.list = Array.from(new Set(notiCopy.list.map((item) => item.notiId))).map((id) => notiCopy.list.find((el) =>  el.notiId === id));
                  //
                  
                      this.updateParts( receiverUid, "followers", receiversCopy, false, notiCopy);
                
                } else {
                  this.notify("Failed", "error");
                }

                const currIndex2 = unupdatedSendersData
                  ?.map((item) => {
                    return item.receiverUid;
                  })
                  .indexOf(receiverUid);
                  if(currIndex2 !== -1){
                    // removes receiver from sender's following array
                    sendersCopy.splice(currIndex2, 1);
                    this.updateParts(senderUid, "following", sendersCopy, true, "");
                  }else{
                    this.notify("Failed", "error");
                  }
              
                
              }
            }else{
              this.notify("Following this user is not allowed. Unblock them first.","error");
            }
        }
        
      });
    }
  }

  handleSendingMessage(textMsg, uid, type) {
    const myUid = this.state.uid;
    if (uid !== myUid) {     
      // Edit receiver's data
      db.collection("users")
        .doc(uid)
        .get()
        .then((items) => {
          const {messages = [], notifications = [], blockList = []} = items?.data();
          const unupdatedReceiversData = messages;
          const noti = notifications;
          
          let notiCopy = JSON.parse(JSON.stringify(noti));
          const isBlocked = blockList.some(d => d.blockedUid === this.state.uid);
          if(!isBlocked){
                    // Edit sender's data
              const myData = this.state.receivedData;
              const unupdatedSendersData = this.state.receivedData?.messages;
              
              const blockedThem = this.state.receivedData?.blockList.some(h => h.blockedUid === uid);
              if(!blockedThem){
                let sendersCopy = JSON.parse(JSON.stringify(unupdatedSendersData));
                  let currIndex = sendersCopy
                  .map((item) => {
                    //ERROR FOUND
                    return item?.uid;
                  })
                  .indexOf(uid);
                  if(currIndex !== -1 ){
                        sendersCopy[currIndex].chatLog.push({
                        textMsg,
                        uid: myUid,
                        userName: myData?.userName,
                        userAvatarUrl: myData?.userAvatarUrl,
                        date: new Date(),
                        type: type,
                      }); 
                      
                      this.updateParts(myUid, "messages", sendersCopy, true, "");
                  }else{
                    this.notify("Failed to send.","error");
                  }
             
                
              }else{
                this.notify("Messaging this user is not allowed because you blocked them.", "error");
              }
            
              let receiversCopy = JSON.parse(
                JSON.stringify(unupdatedReceiversData)
              );
              let currIndex = receiversCopy
                ?.map((el) => {
                  return el.uid;
                })
                .indexOf(myUid); //derives the index from an id
              //looks for ours id in person's data
              if(currIndex !== -1){
                    notiCopy.isNewMsg = true;
                    receiversCopy[currIndex].chatLog.push({
                    textMsg,
                    uid: myUid,
                    userName: myData?.userName,
                    userAvatarUrl: myData?.userAvatarUrl,
                    date: new Date(),
                    type: type,
                  });
              }else{
                this.notify("Failed to send.","error");
              }
           
              this.updateParts(uid, "messages", receiversCopy, false, notiCopy);
          }else{
            this.notify("Messaging this user is not allowed.","error");
          }
          
        });
    } else {
      this.notify("Sending messages to yourself is not allowed", "warning");
    }
  }

  generateNewId = () => {
    return `${Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 20)}_${Math.random() * 10}`;
  };

  initializeChatDialog(uid, receiverName, receiversAvatarUrl) {
    if (
      this.state.receivedData?.messages.filter((el) => el.uid === uid)[0]
        ? false
        : true
    ) {
      // sender
      const unupdatedSendersData = this.state.receivedData?.messages;
      let sendersCopy = JSON.parse(JSON.stringify(unupdatedSendersData));
      const blockedThem = this.state.receivedData?.blockList.some(h => h.blockedUid === uid);
      if(!blockedThem){
          sendersCopy.unshift({
          uid: uid,
          userName: receiverName,
          userAvatarUrl: receiversAvatarUrl,
          date: new Date(),
          chatLog: [],
        });
        let newCopy = Array.from(
          new Set(sendersCopy.map((item) => item.uid))
        ).map((id) => {
          return sendersCopy.find((el) => el.uid === id);
        });
        this.updateParts(this.state.uid, "messages", newCopy, true, "");
      }else{
        this.notify("Not allowed.", "error");
      }
      

      // receiver
     return new Promise((resolve, reject) => {
        db.collection("users")
          .doc(uid)
          .get()
          .then((items) => {
            resolve();
            const {messages = [], blockList = []} = items?.data();
            const unupdatedreceiversData = messages;
            let receiversCopy = JSON.parse(
              JSON.stringify(unupdatedreceiversData)
            );
            const isBlocked = blockList.some(d => d.blockedUid === this.state.uid);
              if(!isBlocked){
              receiversCopy.unshift({
                uid: this.state.uid,
                userName: this.state.receivedData?.userName,
                userAvatarUrl: this.state.receivedData?.userAvatarUrl,
                date: new Date(),
                chatLog: [],
              });
              let newCopy = Array.from(
                new Set(receiversCopy.map((item) => item.uid))
              ).map((id) => {
                return receiversCopy.find((el) => el.uid === id);
              });
              this.updateParts(uid, "messages", newCopy, false, "");
              
            }else{
              this.notify("Not allowed.", "error");
            }
           
          }).catch(() => {
            reject();
          });
     }); 
    }
  }

  handleEditingProfile(formData, type) {
    let copiedArr = JSON.parse(
      JSON.stringify(this.state.receivedData?.profileInfo)
    );
    if (formData && copiedArr) {
      switch (type) {
        case "editProfile":
          Object.keys(copiedArr).length > 0 &&
            Object.keys(copiedArr).map((item) => {
              copiedArr[item] = formData[item];
            });
          break;
        case "professionalAcc":
          if (Object.keys(copiedArr).length > 0 && copiedArr.professionalAcc) {
            copiedArr.professionalAcc = formData;
          }
          break;
        default:
          Object.keys(copiedArr).length > 0 &&
            Object.keys(copiedArr).map((item) => {
              copiedArr[item] = formData[item];
            });
      }
      this.updateParts(this.state.uid, "profileInfo", copiedArr, false, "");
    }
  }

  deletePost(postId, postIndex, contentPath) {
    const buttons = [
      {
        label: "Cancel",
      },
      {
        label: "Delete",
        onClick: () => {
          const myPosts = this.state.receivedData?.posts;
          let postsCopy = JSON.parse(JSON.stringify(myPosts));
          // deletes post data from database

          let extractedIndex = myPosts
            ?.map((el) => {
              return el.id;
            })
            .indexOf(postId);
          if (extractedIndex === postIndex && postIndex !== -1) {
            //makes sure to delete the right post
            postsCopy.splice(postIndex, 1);
            // deletes content from storage
            if (contentPath) {
              this.deleteContentFromFB(contentPath, "content").catch((err) => {
                this.notify(err,"error");
              });
            }
            // updates data
            this.notify("Post deleted");
            this.updateParts(this.state.uid, "posts", postsCopy, true, "");
            this.changeModalState("comments", false);
            
          }
        },
      },
    ];
    this.confirmPrompt(
      "Delete Confirmation",
      buttons,
      "Are you sure you want to delete this post?"
    );
  }

  notify(text, type) {
    switch (type) {
      case "success":
        toast.success(text);
        break;
      case "warning":
        toast.warn(text);
        break;
      case "error":
        toast.error(text);
        break;
      case "info":
        toast.info(text);
      case "dark":
        toast.dark(text);
        break;
      default:
        toast(text);
    }
  }

  confirmPrompt(title, buttons, msg) {
    confirmAlert({
      title,
      buttons,
      message: msg,
    });
  }

  returnPassword = (binary) => {
    const binCode = [];
    for (var i = 0; i < binary.length; i++) {
      binCode.push(String.fromCharCode(parseInt(binary[i], 2)));
    }
    return binCode.join("");
  };

  changeProfilePic = (url) => {
    this.updateParts(this.state.uid, "userAvatarUrl", url, true, "");
  };

  searchUsers = (val, approach) => {
    let madeApproach = approach === "strict" ? "==" : ">=";
    this.setState({
      ...this.state,
      searchInfo: {
        ...this.state.searchInfo,
        loading: true,
      },
    });
    db.collection("users")
      .where("userName", madeApproach, val)
      .limit(50)
      .get()
      .then((snapshot) => {
        const users = snapshot.docs.map((user) => {
          return user.data();
        });
        this.setState({
          ...this.state,
          searchInfo: {
            ...this.state.searchInfo,
            results: users,
            loading: false,
          },
        });
      });
  };

  addPost = (forwardedContent, type) =>{
    if(type === Consts.Post){
    let postsDeepCopy = JSON.parse(JSON.stringify(this.state.receivedData?.posts));
        postsDeepCopy.unshift(forwardedContent);
        return new Promise((resolve, reject) => {
            this.updateParts(this.state.uid, "posts", postsDeepCopy, true, "").then(() => {
              resolve();
            }).catch(() => {
              reject();
            });
        })  
    }else if(type === Consts.Reel){
      let reelsDeepCopy = JSON.parse(JSON.stringify(this.state.receivedData?.reels));
        reelsDeepCopy.unshift(forwardedContent);
        return new Promise((resolve, reject) => {
            this.updateParts(this.state.uid, "reels", reelsDeepCopy, true, "").then(() => {
              resolve();
            }).catch(() => {
              reject();
            });
        })  
    }
  }
  changeModalState = (modalType, state, usersList,usersType) => {

    let copiedObj = JSON.parse(JSON.stringify(this.state.modalsState));
    if(state){
      copiedObj[modalType] = true;
    }else{
      Object.keys(copiedObj).map(key => {
        copiedObj[key] = false;
      });
    }
    this.setState(updateObject(this.state, {modalsState: copiedObj, usersModalList: modalType === "users" && state ? { type: usersType, list:  usersList } : [] }));
    // this.setState({
    //           ...this.state,
    //           modalsState: copiedObj,
    //           usersModalList: modalType === "users" && state ? { type: usersType, list:  usersList } : [],
    // });
  } 

  handleUserBlocking = (blockingState, blockedUid, userName, userAvatarUrl, profileName) => {
    let myBlockListCopy = JSON.parse(JSON.stringify(this.state.receivedData?.blockList));
    let myFollowersCopy = JSON.parse(JSON.stringify(this.state.receivedData?.followers));
    let myFollowingCopy = JSON.parse(JSON.stringify(this.state.receivedData?.following));
    const blockedThem = myBlockListCopy && myBlockListCopy.some(f => f.blockedUid === blockedUid);
    //blocked
    if(myBlockListCopy && blockedUid){
          if(blockingState){
          db.collection("users").doc(blockedUid).get().then((items) => {
            const {followers = [], following = []} = items?.data();
            let theirFollowingCopy = JSON.parse(JSON.stringify(following));
            let theirFollowersCopy = JSON.parse(JSON.stringify(followers));
            let followingThem = theirFollowingCopy.some(o => o.receiverUid === this.state.uid);
            let followedMe = theirFollowersCopy.some(o => o.senderUid === this.state.uid);
                  //update user's data
              if(followingThem || followedMe){
                if(followingThem){
                  const uIndex = theirFollowingCopy.map(q => q.receiverUid).indexOf(this.state.uid);
                  if(uIndex !== -1){
                      theirFollowingCopy.splice(uIndex, 1);
                  }else{
                    this.notify("Failed", "error");
                  }
                 
                }
                if(followedMe){
                  const userIndex = theirFollowersCopy.map(q => q.senderUid).indexOf(this.state.uid);
                  if(userIndex !== -1){
                    theirFollowersCopy.splice(userIndex, 1);
                  }else{
                    this.notify("Failed", "error");
                  }
                  
                }
                  new Promise((resolve, reject) => {
                    db.collection("users")
                          .doc(blockedUid)
                          .update({
                          followers: theirFollowersCopy,
                          following: theirFollowingCopy
                          })
                          .then(() => {
                            resolve();
                          }).catch((err) =>{
                            reject(err.message);
                        });
                }) 
              }
              
          });

            //updates follow states
              if(myFollowersCopy.some(o => o.senderUid === blockedUid)){
              
                const userIndex = myFollowersCopy.map(q => q.senderUid).indexOf(blockedUid);
                if(userIndex !== -1){
                   myFollowersCopy.splice(userIndex, 1);
                }else{
                  this.notify("Failed","error");
                }
               
              }
              if(myFollowingCopy.some(p => p.receiverUid === blockedUid)){
                const uIndex = myFollowingCopy.map(q => q.receiverUid).indexOf(blockedUid);
                if(uIndex !== -1){
                   myFollowingCopy.splice(uIndex, 1);
                }else{
                  this.notify("Failed","error");
                }
               
              }   
            //updates block list
          myBlockListCopy.unshift({
            blockedUid,
            userName,
            userAvatarUrl,
            profileName,
          })
        }else if(!blockingState){
          //unblocked
          if(myBlockListCopy.some(l => l.blockedUid === blockedUid) && blockedUid){
            const bIndex = myBlockListCopy.map(u => u.blockedUid).indexOf(blockedUid);
            if(bIndex !== -1){
               myBlockListCopy.splice(bIndex, 1);
            }else{
              this.notify("Failed", "error");
            }
           
          };
        }
        
        let newBlockedArray = Array.from(
          new Set(myBlockListCopy.map((itemId) => itemId.blockedUid))
        ).map((ID) => myBlockListCopy.find((el) => el.blockedUid === ID));
        //update my data
    return new Promise((resolve, reject) => {
            db.collection("users")
                        .doc(this.state.uid)
                        .update({
                          blockList: newBlockedArray,
                          followers: myFollowersCopy,
                          following: myFollowingCopy,
                        })
                        .then(() => {
                          this.notify(blockingState ? `${userName ? userName : "User"} has been blocked` : `${userName ? userName : "User"} has been unblocked`);
                          resolve();
                        }).catch((err) =>{
                          reject(err.message);
                          this.notify(err.message || "Failed to block user.");
                      });
        }) 
    }
    
  }

  onCommentDeletion = (type,commentUid, postId, commentId,postIndex, commentIndex, subCommentId, subCommentIndex, postOwnerId, postsArray) => {

    if(commentUid === this.state.uid && postsArray && postsArray.length >0){
      const getPostIndex = postsArray && postsArray.map(post => post?.id).indexOf(postId);
      const postsCopy = JSON.parse(JSON.stringify(postsArray));
      if(getPostIndex === postIndex && getPostIndex !== -1){
        const getCommentIndex = postsCopy[postIndex].comments && postsCopy[postIndex].comments.map(comment => comment?.commentId).indexOf(commentId);
        if(getCommentIndex === commentIndex && getCommentIndex !== -1 ){
          if(type === "comment"){
             postsCopy && postsCopy[postIndex].comments.splice(getCommentIndex, 1);
          }else if(type === "subComment"){
            const getSubCommentIndex = postsCopy[postIndex].comments && postsCopy[postIndex].comments[getCommentIndex].subComments && postsCopy[postIndex].comments[getCommentIndex].subComments.map(subComment => subComment?.subCommentId).indexOf(subCommentId);
            if(getSubCommentIndex === subCommentIndex && getSubCommentIndex !== -1){
              postsCopy && postsCopy[postIndex].comments[getCommentIndex].subComments.splice(getSubCommentIndex, 1);
            }
          }
          const buttons = [
              {
                label: "No",
              },
              {
                label: "Yes",
                onClick: () => {
                      this.updateParts(postOwnerId, "posts", postsCopy, true, "").then(() => {
                        this.notify(`${type  === "comment" ? "Comment" : "Reply"} deleted`);
                      }).catch((err) => {
                        this.notify(err || "An error occurred");
                      });
                },
              },
            ];
            this.confirmPrompt("Confirmation", buttons, "Comment will be deleted. Proceed?");

        }else{
          this.notify("An error occurred. Please try to delete comment later1.","error");
        }
      }else{
        this.notify("An error occurred. Please try to delete comment later2.","error");
      }
    }else{
      this.notify("Comment deletion of other users is prohibited.","error");
    }    
  }

  render() {
    return (
      <AppContext.Provider
        value={{
          //states
          receivedData: this.state.receivedData,
          uid: this.state.uid,
          suggestionsList: this.state.suggestionsList,
          usersProfileData: this.state.usersProfileData,
          currentPostIndex: this.state.currentPostIndex,
          usersModalList: this.state.usersModalList,
          igVideoImg: this.state.igVideoImg,
          currentPage: this.state.currentPage,
          currentUser: this.state.currentUser,
          isUserOnline: this.state.isUserOnline,
          reelsProfile: this.state.reelsProfile,
          searchInfo: this.state.searchInfo,
          modalsState: this.state.modalsState,
          currentChatIndex: this.state.currentChatIndex,
          addPost: this.addPost.bind(this),//functions
          generateNewId: this.generateNewId.bind(this),
          updatedReceivedData: this.updatedReceivedData.bind(this),
          updateUserState: this.updateUserState.bind(this),
          updateUID: this.updateUID.bind(this),
          handleMyLikes: this.handleMyLikes.bind(this),
          deleteContentFromFB: this.deleteContentFromFB.bind(this),
          handleSubmittingComments: this.handleSubmittingComments.bind(this),
          updateSuggestionsList: this.updateSuggestionsList.bind(this),
          getUsersProfile: this.getUsersProfile.bind(this),
          changeMainState: this.changeMainState.bind(this),
          handlePeopleLikes: this.handlePeopleLikes.bind(this),
          updateParts: this.updateParts.bind(this),
          resetAllData: this.resetAllData.bind(this),
          handleSubComments: this.handleSubComments.bind(this),
          handleLikingComments: this.handleLikingComments.bind(this),
          authLogout: this.authLogout.bind(this),
          handleFollowing: this.handleFollowing.bind(this),
          handleSendingMessage: this.handleSendingMessage.bind(this),
          initializeChatDialog: this.initializeChatDialog.bind(this),
          closeNotificationAlert: this.closeNotificationAlert.bind(this),
          deletePost: this.deletePost.bind(this),
          handleEditingProfile: this.handleEditingProfile.bind(this),
          notify: this.notify.bind(this),
          confirmPrompt: this.confirmPrompt.bind(this),
          returnPassword: this.returnPassword.bind(this),
          changeProfilePic: this.changeProfilePic.bind(this),
          searchUsers: this.searchUsers.bind(this),
          changeModalState: this.changeModalState.bind(this),
          handleUserBlocking: this.handleUserBlocking.bind(this),
          onCommentDeletion: this.onCommentDeletion.bind(this),
        }}
      >
        {this.props.children}
      </AppContext.Provider>
    );
  }
}
const AppConsumer = AppContext.Consumer;

export { AppProvider, AppContext, AppConsumer };
