import React, { useContext, useEffect, useState, Fragment } from "react";
import "./Explore.scss";
import { AppContext } from "../../Context";
import { useHistory } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../Config/firebase";
import PostModal from "../../Components/DesktopPost/DesktopPost";
import ProfileItem from "../../Components/ProfileItem/ProfileItem";
import { MdSort } from "react-icons/md";
import Modal from "react-modal";
import InputForm from "../../Components/Generic/InpuForm/InputForm";
import { BiCog } from "react-icons/bi";
import { CgUnavailable } from "react-icons/cg";

const Explore = () => {
  const context = useContext(AppContext);
  const {
    explore,
    changeMainState,
    changeModalState,
    getUsersProfile,
    usersProfileData,
    notify,
    modalsState,
    currentPostIndex,
    receivedData,
    handleChangingSort,
    loadingState
  } = context;
  const [newExploreArr, setExploreArr] = useState([]);
  const [sortingModalIsOpen, setSortingModal] = useState(false);
  const [sortByOptions] = useState([
    "Random",
    "Likes Count",
    "Comments Count",
    "Date"
  ])
  const [sortForm, setSortForm] = useState({
    sortBy: receivedData?.profileInfo?.sort?.sortBy || "Random",
    sortDirection: receivedData?.profileInfo?.sort?.sortDirection || "Descending",
    filter: receivedData?.profileInfo?.sort?.filter || "None"
  });
  const [ submitted, setSubmission ] = useState(false);
  const [, loading] = useAuthState(auth);
  const history = useHistory();
  const onInputChange =  (val, name) => setSortForm({...sortForm, [name]: val});

  const getRandom = (length) => {
    const newLength = explore.length < 0 || length < 0 ? 0 : length;
    if (newLength >= 0) {
      return Math.floor(Math.random() * newLength);
    }
  };
  function shufflePosts(array) {
    var j, x, i;
    for (i = array.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = array[i];
      array[i] = array[j];
      array[j] = x;
      return array || [];
    }
  }
  const randomPosts = () => {
   return shufflePosts(
    explore?.length > 0 ? explore.map((posts) =>
        posts && posts.length > 0 ? posts[getRandom(posts?.length)] : []
      )
      : []
    );
  }
  useEffect(() => {
    changeMainState("currentPage", "Explore");
  }, []);
  useEffect(() => {
    if(sortingModalIsOpen){
      document.body.style.overflow = "hidden";
    }else{
      document.body.style.overflow = "visible";
    }
    return () => {
      document.body.style.overflow = "visible";
    }
  },[sortingModalIsOpen]);
  const sortPosts = () => {
    const {sortBy= "Random", sortDirection = "Descending", filter = "None"} = sortForm;
    const underscoreVal = (val) => val?.toLowerCase()?.split(" ")?.join("_");
    const alteredSortBy = underscoreVal(sortBy);
    const alteredSortDirection = underscoreVal(sortDirection);
    const alteredSortFilter = underscoreVal(filter);
    if(explore && explore.length > 0){
      let exploreAlteredArr;
      switch(alteredSortFilter){
        case "posts_by_people_i_follow":
          exploreAlteredArr = explore?.filter(user => user?.some(post => receivedData?.following?.some(item => item?.receiverUid === post?.postOwnerId)));
        break;
        case "images_only":
          exploreAlteredArr = explore?.map(user => user?.filter(post => {
           return post?.contentType === "image"
          }));
        break;
        case "audio_only":
          exploreAlteredArr = explore?.map(user => user?.filter(post => {
           return post?.contentType === "audio"
          }));
        break;
        case "videos_only":
          exploreAlteredArr = explore?.map(user => user?.filter(post => post?.contentType === "video"));
        break;
        case "None":
          exploreAlteredArr = explore;
        break;
        default:
          exploreAlteredArr = explore;
      }
      if(exploreAlteredArr?.length > 0){
          switch (alteredSortBy){
                  case "likes_count":
                    return exploreAlteredArr.map(el => {
                      return el.sort((a,b)=> {
                          return b.likes?.people?.length - a.likes?.people?.length;
                        })[0];
                    }).sort((a,b)=> {
                      return alteredSortDirection === "ascending" ? (a.likes?.people?.length - b.likes?.people?.length) : (b.likes?.people?.length - a.likes?.people?.length) ;
                    });
                    case "comments_count":
                      return exploreAlteredArr.map(el => {
                        return el.sort((a,b)=> {
                            return b.comments?.length - a.comments?.length
                          })[0];
                      }).sort((a,b)=> {
                        return alteredSortDirection === "ascending" ? (a.comments?.length - b.comments?.length) :  (b.comments?.length - a.comments?.length);
                      });
                    case "date":
                      return exploreAlteredArr.map(el => {
                        return el.sort((a,b)=> {
                            return b.date?.seconds- a.date?.seconds;
                          })[0];
                      }).sort((a,b)=> {
                        return alteredSortDirection === "ascending" ? (a.date?.seconds - b.date?.seconds) : (b.date?.seconds - a.date?.seconds);
                      });
                    case "random":
                      setSortForm({...sortForm, sortDirection: "Descending", filter: "None"});
                    return randomPosts() || [];
                    default :
                    return randomPosts() || [];
                }
      }
     
    }else{
      return [];
    }
  }
  const updateSortedElements = () => {
    setExploreArr(sortPosts());
  }
  useEffect(() => {
    if (explore && explore.length > 0) {
      const sortArr = receivedData?.profileInfo?.sort;
    
      if(sortArr){
        const {sortBy, sortDirection, filter} = sortArr; 
        setSortForm({
          sortBy,
          sortDirection,
          filter
          });
      }
      updateSortedElements();
    }
  }, [explore]);
  const openPost = (postId, _ ,uid) => {
    if(uid, postId){
            getUsersProfile(uid).then((res) => {
        const getPostIndex = res?.posts.map((post) => post?.id).indexOf(postId);

        if (getPostIndex !== -1) {
          changeMainState("currentPostIndex", {
            index: getPostIndex,
            id: postId,
          });
          if (
            (window.innerWidth || document.documentElement.clientWidth) >= 670
          ) {
            // Desktop
            changeModalState("post", true);
          } else {
            // Mobile
            history.push("/browse-post");
          }
        } else {
          notify("Post is not available or got removed", "error");
        }
      });
    }

  };
  //reminder: overflow hidden when explore modal is open
  const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)',
    }
  };
  const onSettingsSubmission = (c) => {
    c.preventDefault();
    if(!sortForm?.sortDirection){
        sortForm.sortDirection = "Descending";
      }
      if(!sortForm?.sortBy){
        sortForm.sortBy = "Random";
      } 
      if(!sortForm?.filter){
        sortForm.filter = "None";
      } 
    if(sortForm?.sortBy && sortForm?.sortDirection && sortForm?.filter){
      handleChangingSort(sortForm);
      setSortingModal(false);
      updateSortedElements();
      setSubmission(true);
    }else{
      notify("An option on each field should be selected","error");
    }
  }
  let isValid = true;
  if (sortForm && Object.keys(sortForm).length > 0 && receivedData?.profileInfo?.sort && Object.keys(receivedData?.profileInfo?.sort).length > 0) {
    isValid =
    Object.values(sortForm)?.every(item => item && item !== "") &&
      Object.keys(sortForm).some(
        (el) => sortForm[el] !== receivedData?.profileInfo?.sort?.[el]
      );
  }
  return (
    <Fragment>
      {/* Modals */}
      {modalsState?.post &&
        usersProfileData?.posts[currentPostIndex?.index] && (
          <PostModal disableArrows={true} />
        )}
        <div className="explore--modal">
            <Modal
          ariaHideApp={false}
          isOpen={ sortingModalIsOpen }
          onRequestClose={() =>setSortingModal(false)}
          style={customStyles}
          contentLabel="Sorting Modal"
        >

          <h2 className="flex-row"><BiCog className="mr-1" />Settings</h2>
          <form onSubmit={(e) => onSettingsSubmission(e)}>
                      <InputForm
                            required={true}
                            autoFocus={true}
                            type="select"
                            name="sortBy"
                            label="Sort By"
                            options={sortByOptions}
                            val={sortForm?.sortBy}
                            changeInput={onInputChange}
                            submitted={submitted}
                      />
                      {
                        sortForm?.sortBy?.toLowerCase() !== "random" &&
                        <div>
                            <InputForm
                              required={true}
                              type="select"
                              name="sortDirection"
                              label="Sort Order"
                              options={["Ascending", "Descending"]}
                              val={sortForm?.sortDirection}
                              changeInput={onInputChange}
                              submitted={submitted}
                          />
                          <InputForm
                            required={true}
                            type="select"
                            name="filter"
                            label="filter"
                            options={["None", "Posts By People I Follow", "Images Only", "Videos Only", "Audio Only"]}
                            val={sortForm?.filter}
                            changeInput={onInputChange}
                            submitted={submitted}
                        /> 
                        </div>
                      } 

                      <div className="explore__modal__btns flex-row">
                        <span className="profile__btn explore__close__btn" onClick={() => setSortingModal(false)}>close</span>
                        <input disabled={!isValid} className={`profile__btn primary__btn ${!isValid && "disabled"}`} type="submit" value="Save"/>
                      </div>
                     
          </form>

         
         
        </Modal>
        </div>
        
      {/* End of Modals */}
      <section id="explore" className="explore-container flex-column">
        <div className="desktop-comp explore-inner flex-column">
          {/* explore start */}
          <div id="usersProfile" className="users--profile--container ">
            <div className="explore--options--btn">
                <button onClick={()=> setSortingModal(true)}><MdSort /></button>
            </div>
            {newExploreArr ? (
              explore &&
              explore?.length > 0 &&
              newExploreArr.length >= 1 &&
               (!loading || !loadingState?.suggList) ? (
                <div>
                  <div className="explore--upper--row">
                  {newExploreArr.slice(0,2).map((post, index) => (
                    post &&
                    <ProfileItem withOwnersName={true} className="explore--upper--row--item" key={post?.id + index} post={post} openPost={openPost} index={index}/>
                  ))}
                  </div>
                  <div className="users--profile--posts">
                    {newExploreArr.slice(2).map((post, index) => (
                      post &&
                     <ProfileItem withOwnersName={true} key={post?.id + index} post={post} openPost={openPost} index={index}/>
                    ))}
                  </div>
                </div>
              ) : loadingState?.suggList ? (
                <div className="w-100 flex-row" style={{overflow: "hidden"}}>
                    <Skeleton
                    count={8}
                    height={200}
                    width={200}
                    className="m-2"
                    duration={10}
                  />
                </div>

              ) : (
                <div className="empty--posts--container flex-column">
                  <div className="empty--posts--inner mx-auto flex-column">
                    <div className="plus--icon--container flex-column">
                      <CgUnavailable className="plus__icon" />
                    </div>
                    <h3>No posts available</h3>
                    <p>
                      When you share photos and videos, they'll <br /> be appear
                      on your profile page
                    </p>

                    <span>Share your first photo or video</span>
                  </div>
                </div>
              )
            ) : (
              <h4 className="text-center">No results found.</h4>
            )}
          </div>
          {/* explore end */}
        </div>
      </section>
    </Fragment>
  );
};

export default Explore;
