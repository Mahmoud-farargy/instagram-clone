import React, { useContext, useEffect, useState, Fragment } from "react";
import "./Explore.scss";
import { AppContext } from "../../Context";
import { useHistory } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../Config/firebase";
import PostModal from "../../Components/DesktopPost/DesktopPost";
import ProfileItem from "../../Components/ProfileItem/ProfileItem";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
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
    handleChangingSort
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
    sortBy: "Random",
    sortDirection: "Descending",
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
  const sortPosts = (sortBy, direction) => {
    const underscoreVal = (val) => val?.toLowerCase()?.split(" ")?.join("_");
    const alteredSortBy = underscoreVal(sortBy);
    const alteredSortDirection = underscoreVal(direction);
    if(explore && explore.length > 0){
      switch (alteredSortBy){
        case "likes_count":
          return explore.map(el => {
            return el.sort((a,b)=> {
                return b.likes?.people?.length - a.likes?.people?.length;
              })[0];
          }).sort((a,b)=> {
            return  alteredSortDirection === "ascending" ? (a.likes?.people?.length - b.likes?.people?.length) : (b.likes?.people?.length - a.likes?.people?.length) ;
          });
          case "comments_count":
            return explore.map(el => {
              return el.sort((a,b)=> {
                  return b.comments?.length - a.comments?.length
                })[0];
            }).sort((a,b)=> {
              return alteredSortDirection === "ascending" ? (a.comments?.length - b.comments?.length) :  (b.comments?.length - a.comments?.length);
            });
          case "date":
            return explore.map(el => {
              return el.sort((a,b)=> {
                  return b.date?.seconds- a.date?.seconds;
                })[0];
            }).sort((a,b)=> {
              return  alteredSortDirection === "ascending" ? (a.date?.seconds - b.date?.seconds) : (b.date?.seconds - a.date?.seconds);
            });
          case "random":
           return randomPosts() || [];
          default :
          return randomPosts() || [];
      }
    }else{
      return [];
    }
  }
  const updateSortedElements = () => {
    setExploreArr(sortPosts(( sortForm?.sortBy || receivedData?.profileInfo?.sort?.sortBy || "Random" ), ( sortForm?.sortDirection || receivedData?.profileInfo?.sort?.sortDirection || "Descending" )) || []);
  }
  useEffect(() => {
    if (explore && explore.length > 0) {
      updateSortedElements();
      if(receivedData?.profileInfo?.sort && Object.keys(receivedData?.profileInfo?.sort).length > 0){
        updateSortedElements();
        const sortArr = receivedData?.profileInfo?.sort;
        Object.keys(sortArr).map(item =>{
          return setSortForm({[item] : sortArr[item]});
        })
       
      }
    }
  }, [explore]);
  const openPost = (postId, _ ,uid) => {
    if(uid){
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
    if(sortForm?.sortBy && sortForm?.sortDirection){
      handleChangingSort(sortForm);
      setSortingModal(false);
      updateSortedElements();
      setSubmission(true);
    }else{
      notify("An option on each field should be selected","error");
    }
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
                      } 
                      <div className="explore__modal__btns flex-row">
                        <span className="profile__btn explore__close__btn" onClick={() => setSortingModal(false)}>close</span>
                        <input className="profile__btn prof__btn__followed" type="submit" value="Save"/>
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
                <button onClick={()=> setSortingModal(true)}><HiOutlineDotsHorizontal /></button>
            </div>
          
            {newExploreArr ? (
              explore &&
              explore?.length > 0 &&
              newExploreArr.length >= 1 &&
              !loading ? (
                <div>
                  <div className="explore--upper--row">
                  {newExploreArr.slice(0,2).map((post, index) => (
                    <ProfileItem className="explore--upper--row--item" key={post?.id + index} post={post} openPost={openPost} index={index}/>
                  ))}
                  </div>
                  <div className="users--profile--posts">
                    {newExploreArr.slice(2).map((post, index) => (
                     <ProfileItem key={post?.id + index} post={post} openPost={openPost} index={index}/>
                    ))}
                  </div>
                </div>
              ) : loading ? (
                <Skeleton
                  count={10}
                  height={550}
                  width={550}
                  className="mt-4 mr-4 mx-auto"
                />
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
              <p>loading...</p>
            )}
          </div>
          {/* explore end */}
        </div>
      </section>
    </Fragment>
  );
};

export default Explore;
