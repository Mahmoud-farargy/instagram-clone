import React, { PureComponent } from "react";
import { db, auth, storageRef } from "./Config/firebase";
import igVideoImg from "./Assets/instagram-video.png";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
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
      currentPostIndex: {},
      openUsersModal: false,
      usersModalList: [],
      igVideoImg: igVideoImg,
      openCommentsModal: false,
      currentPage: "",
      searchInfo: { results: [], loading: false },
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
      db.collection("users")
        .doc(uid)
        .update({
          [stateBase]: newState,
        })
        .then(() => {
          if (updateAbility === true || uid === this.state.receivedData?.uid) {
            this.updatedReceivedData();
          }
        });
    } else {
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
        });
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
      ? likesArr.people.push({
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
        let unupdatedPosts = items.data().posts;
        let unupdatedNoti = items.data().notifications;

        let dataCopy = JSON.parse(JSON.stringify(unupdatedPosts));
        let notiCopy = JSON.parse(JSON.stringify(unupdatedNoti));

        var likesArr = dataCopy[postIndex].likes;
        function getPeopleIndex() {
          var currIndex;
          likesArr.people.find((item, i) => {
            currIndex = i;
            return item.id === myId;
          });
          return currIndex;
        }
        if (boolean) {
          //handles notifications
          notiCopy.isUpdate = true;
          const generatedID = this.generateNewId();
          likesArr.people.push({
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
      });

      this.updateParts(myId, "posts", myPostsCopy, true, "");
    } else if (ownership === "others") {
      db.collection("users")
        .doc(ownerId)
        .get()
        .then((items) => {
          let oldPosts = items.data().posts;
          let noti = items.data().notifications;
          let theirPostsCopy = JSON.parse(JSON.stringify(oldPosts));
          let notiCopy = JSON.parse(JSON.stringify(noti));
          const generatedID = this.generateNewId();
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
          });
          notiCopy.isUpdate = true;
          notiCopy.list.unshift({
            uid: myId,
            userName: ownerId === myId ? "You" : userName,
            userAvatarUrl: this.state.receivedData?.userAvatarUrl,
            date: new Date(),
            notiId: generatedID,
            contentURL,
            contentType,
            notiText: `commented on your ${contentType} post: ${comment} `,
            type: "comment",
          });

          this.updateParts(ownerId, "posts", theirPostsCopy, false, notiCopy);
        });
    }
  }

  deleteContentFromFB(path) {
    path && storageRef.child(`content/${this.state.uid}/${path}`).delete();
  }
  getUsersProfile(uid) {
    db.collection("users")
      .doc(uid)
      .onSnapshot((snapshot) => {
        this.setState({
          ...this.state,
          usersProfileData: snapshot.data(),
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
    const { commentIndex, postIndex, postId, postOwnerId } = commentInfo;
    db.collection("users")
      .doc(postOwnerId)
      .get()
      .then((items) => {
        let unupdatedPosts = items.data().posts;
        let noti = items.data().notifications;
        const postsCopy = JSON.parse(JSON.stringify(unupdatedPosts));
        const notiCopy = JSON.parse(JSON.stringify(noti));

        let matchedIndex = postsCopy
          .map((el) => {
            return el.id;
          })
          .indexOf(postId);
        if (postIndex === matchedIndex) {
          var notiId = this.generateNewId();
          postsCopy[postIndex].comments[commentIndex].subComments.push({
            commentText: commentText,
            postId: postId,
            postOwnerId: postOwnerId,
            senderName: this.state.receivedData?.userName,
            userAvatarUrl: userAvatarUrl,
            notiId: notiId,
            date: new Date(),
          });
          if (postOwnerId !== this.state.uid) {
            notiCopy.isUpdate = true;
            notiCopy.list.unshift({
              uid: this.state.uid,
              userName:
                postOwnerId === this.state.uid
                  ? "You"
                  : this.state.receivedData?.userName,
              notiId,
              contentURL,
              contentType,
              userAvatarUrl: this.state.receivedData?.userAvatarUrl,
              date: new Date(),
              notiText: `mentioned you in a comment: ${commentText}`,
              type: "sub-comment",
            });
          }
          this.updateParts(
            postOwnerId,
            "posts",
            postsCopy,
            updatingAbility,
            notiCopy
          );
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
    boolean,
    postIndex,
    postOwnerId,
    userName,
    userAvatarUrl,
    myId,
    commentIndex,
    commentText,
    contentURL,
    contentType
  ) => {
    db.collection("users")
      .doc(postOwnerId)
      .get()
      .then((items) => {
        let unupdatedPosts = items.data()?.posts;
        let noti = items.data()?.notifications;
        let dataCopy = JSON.parse(JSON.stringify(unupdatedPosts));
        let notiCopy = JSON.parse(JSON.stringify(noti));

        var likesArr = dataCopy[postIndex].comments[commentIndex];
        if (unupdatedPosts && likesArr) {
          if (boolean) {
            //like
            let generatedID = this.generateNewId();
            likesArr.likes.push({
              id: myId,
              userName: userName,
              userAvatarUrl: userAvatarUrl,
              notiId: generatedID,
              date: new Date(),
            });
            notiCopy.isUpdate = true;
            notiCopy.list.unshift({
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
          } else {
            //unlike
            let index = likesArr.likes
              ?.map((el) => {
                return el.id;
              })
              .indexOf(myId);
            if (index !== -1) {
              let notiIndex = notiCopy.list
                ?.map((el) => {
                  console.log(el.notiId, likesArr.likes);
                  return el.notiId;
                })
                .indexOf(likesArr.likes?.notiId);
              if (notiIndex !== -1) {
                notiCopy.list.splice(notiIndex, 1); //<<< FIX THIS
              } else {
                // this.notify("error likes 304", "error");
              }
              likesArr.likes.splice(index, 1);
            } else {
              this.notify("context 310 err", "error");
            }
          }

          likesArr.likes = Array.from(
            new Set(likesArr.likes.map((itemId) => itemId.id))
          ).map((ID) => likesArr.likes.find((el) => el.id === ID));

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
    db.collection("users")
      .doc(receiverUid)
      .get()
      .then((items) => {
        var unupdatedReceiversData = items.data()?.followers; //receiver's data
        var unupdatedSendersData = this.state.receivedData?.following; //sender's data
        var noti = items.data()?.notifications;
        let receiversCopy = JSON.parse(JSON.stringify(unupdatedReceiversData)); //creates a copy for each user's data
        let sendersCopy = JSON.parse(JSON.stringify(unupdatedSendersData));
        let notiCopy = JSON.parse(JSON.stringify(noti));
        if (!state) {
          //follow
          // pushes sender's data into followers receiver's array

          if (receiverUid !== senderUid) {
            //makes sure the user somehow doesn't follow themselves
            const generatedID = this.generateNewId();

            receiversCopy.push({
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
            notiCopy.list.unshift({
              notiId: generatedID,
              userName: senderName,
              uid: senderUid,
              date: new Date(),
              type: "follow",
              userAvatarUrl: senderAvatarUrl,
              notiText: `started following you`,
            });
            this.updateParts(
              receiverUid,
              "followers",
              newReceiversCopy,
              false,
              notiCopy
            );

            // pushes receiver's data into following sender's array
            sendersCopy.push({
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
              // this.notify("aborted2", "error");
            }
            this.updateParts(
              receiverUid,
              "followers",
              receiversCopy,
              false,
              notiCopy
            );
          } else {
            this.notify("aborted", "error");
          }

          const currIndex2 = unupdatedSendersData
            ?.map((item) => {
              return item.receiverUid;
            })
            .indexOf(receiverUid);
          // removes receiver from sender's following array
          sendersCopy.splice(currIndex2, 1);
          this.updateParts(senderUid, "following", sendersCopy, true, "");
        }
      });
  }

  handleSendingMessage(textMsg, uid, type) {
    const myUid = this.state.uid;
    if (uid !== myUid) {
      // Edit sender's data
      const myData = this.state.receivedData;
      const unupdatedSendersData = this.state.receivedData?.messages;
      let sendersCopy = JSON.parse(JSON.stringify(unupdatedSendersData));
      let currIndex = sendersCopy
        .map((item) => {
          //ERROR FOUND
          return item?.uid;
        })
        .indexOf(uid);
      sendersCopy[currIndex].chatLog.push({
        textMsg,
        uid: myUid,
        userName: myData?.userName,
        userAvatarUrl: myData?.userAvatarUrl,
        date: new Date(),
        type: type,
      });

      this.updateParts(myUid, "messages", sendersCopy, true, "");

      // Edit receiver's data
      db.collection("users")
        .doc(uid)
        .get()
        .then((items) => {
          const unupdatedReceiversData = items.data()?.messages;
          const noti = items.data()?.notifications;
          let receiversCopy = JSON.parse(
            JSON.stringify(unupdatedReceiversData)
          );
          let notiCopy = JSON.parse(JSON.stringify(noti));
          let currIndex = receiversCopy
            ?.map((el) => {
              return el.uid;
            })
            .indexOf(myUid); //derives the index from an id
          //looks for ours id in person's data
          notiCopy.isNewMsg = true;
          receiversCopy[currIndex].chatLog.push({
            textMsg,
            uid: myUid,
            userName: myData?.userName,
            userAvatarUrl: myData?.userAvatarUrl,
            date: new Date(),
            type: type,
          });
          this.updateParts(uid, "messages", receiversCopy, false, notiCopy);
        });
    } else {
      this.notify("Sending messages to yourself is not allowed", "warning");
    }
  }

  generateNewId = () => {
    let char1 = "G";
    let char2 = "j";
    let char3 = "k";
    let char4 = "M";
    let char5 = "N";
    let char6 = "Z";
    var charRandom = () => {
      return Math.floor(Math.random() * 6 + 1);
    };
    for (let i = 0; i < 5; i++) {
      charRandom(); //calls the "charRandom" function repeatedly 6 time, each time a new character will be created.
      switch (
        charRandom() //determines which new char will be created for each variable
      ) {
        case 1:
          char1 = "A";
          break;
        case 2:
          char2 = "B";
          break;
        case 3:
          char3 = "C";
          break;
        case 4:
          char4 = "D";
          break;
        case 5:
          char5 = "E";
          break;
        default:
          char6 = "F";
      }
    }

    const numRandom = () => {
      return (
        char1 + char2 + char3 + Math.random() * 9999 + 1 + char4 + char5 + char6
      );
    };

    return numRandom();
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
      sendersCopy.push({
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

      // receiver
      db.collection("users")
        .doc(uid)
        .get()
        .then((items) => {
          const unupdatedreceiversData = items.data().messages;
          let receiversCopy = JSON.parse(
            JSON.stringify(unupdatedreceiversData)
          );
          receiversCopy.push({
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
        });
    }
  }
  handleUsersModal(newState, list, type) {
    this.setState({
      ...this.state,
      openUsersModal: newState,
      usersModalList: newState ? { type: type, list: list } : null,
    });
  }
  handleCommentsModal(boolean) {
    this.setState({
      ...this.state,
      openCommentsModal: boolean,
    });
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
          if (extractedIndex === postIndex) {
            //makes sure to delete the right post
            postsCopy.splice(postIndex, 1);
            // deletes content from storage
            if (contentPath) {
              this.deleteContentFromFB(contentPath);
            }
            // updates data
            this.updateParts(this.state.uid, "posts", postsCopy, true, "");
            this.setState({
              ...this.state,
              openCommentsModal: false,
            });
            this.notify("Post deleted");
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
          openUsersModal: this.state.openUsersModal,
          usersModalList: this.state.usersModalList,
          igVideoImg: this.state.igVideoImg,
          openCommentsModal: this.state.openCommentsModal,
          currentPage: this.state.currentPage,
          currentUser: this.state.currentUser,
          isUserOnline: this.state.isUserOnline,
          searchInfo: this.state.searchInfo, //functions
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
          handleUsersModal: this.handleUsersModal.bind(this),
          handleCommentsModal: this.handleCommentsModal.bind(this),
          deletePost: this.deletePost.bind(this),
          handleEditingProfile: this.handleEditingProfile.bind(this),
          notify: this.notify.bind(this),
          confirmPrompt: this.confirmPrompt.bind(this),
          returnPassword: this.returnPassword.bind(this),
          changeProfilePic: this.changeProfilePic.bind(this),
          searchUsers: this.searchUsers.bind(this),
        }}
      >
        {this.props.children}
      </AppContext.Provider>
    );
  }
}
const AppConsumer = AppContext.Consumer;

export { AppProvider, AppContext, AppConsumer };
