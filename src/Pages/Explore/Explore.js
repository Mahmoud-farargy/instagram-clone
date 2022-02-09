import React, { useContext, useEffect, useState, Fragment, useRef, memo } from "react";
import "./Explore.scss";
import { AppContext } from "../../Context";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../Config/firebase";
import PostModal from "../../Components/DesktopPost/DesktopPost";
import { MdSort } from "react-icons/md";
import Modal from "react-modal";
import InputForm from "../../Components/Generic/InpuForm/InputForm";
import { BiCog } from "react-icons/bi";
import * as Consts from "../../Utilities/Consts";
import { lowerCaseString } from "../../Utilities/Utility";
import { CgUnavailable } from "react-icons/cg";
import ProfilePosts from "../../Components/ProfilePosts/ProfilePosts";
import LoadingComponent from "../../Components/Generic/LoadingScreen/LoadingComponent";
import { connect } from "react-redux";

const Explore = ({ modalsState, explore, isUsersListLoading }) => {
  const context = useContext(AppContext);
  const {
    changeMainState,
    notify,
    receivedData,
    handleChangingSort,
    mutateLoadingState
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
  const _isMounted = useRef(true);
  const [, loading] = useAuthState(auth);
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
    mutateLoadingState({key: "suggList", val: true});
    changeMainState("currentPage", "Explore");
    return() => _isMounted.current = false;
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
      // filter
      const filterByType = (type) => {
        exploreAlteredArr = explore?.map(user => user?.filter(post => lowerCaseString(post?.contentType) === lowerCaseString(type)));
      }
      switch(alteredSortFilter){
        case "posts_by_people_i_follow":
          exploreAlteredArr = explore?.filter(user => user?.some(post => receivedData?.following?.some(item => item?.receiverUid === post?.postOwnerId)));
        break;
        case "images_only":
          filterByType(Consts.Image);
        break;
        case "audio_only":
          filterByType(Consts.Audio);
        break;
        case "videos_only":
          filterByType(Consts.Video);
        break;
        case "tweets_only":
          filterByType(Consts.Tweet);
        break;
        case "polls_only":
          filterByType(Consts.Poll);
        break;
        case "youtube_only":
          filterByType(Consts.YoutubeVid);
        break;
        case "None":
          exploreAlteredArr = explore;
        break;
        default:
          exploreAlteredArr = explore;
      }
      if(exploreAlteredArr?.length > 0){
        // sort
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
      }else{
          return [];
      }
     
    }else{
      return [];
    }
  }
  const updateSortedElements = () => {
    setExploreArr(sortPosts().filter(Boolean));
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
      {modalsState?.post && (
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
                            options={["None", "Posts By People I Follow", "Images Only", "Videos Only", "Audio Only", "Tweets Only", "Polls only", "Youtube only"]}
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
            {  (isUsersListLoading || loading) ? (
                <LoadingComponent />
              ) :
              (newExploreArr && newExploreArr.length > 0) ? (
              explore &&
              explore?.length > 0 ? (
                // TODO: USE CSS GRID INSTEAD
                <div>
                  <div>
                   {newExploreArr?.length > 0 && <ProfilePosts listType="post" list={ newExploreArr.slice(0,2) } className="explore--upper--row--item" withOwnersName={true} parentClass="explore--upper--row"/>}
                  </div>
                  <div>
                      {newExploreArr?.length >= 2 && <ProfilePosts listType="post" list={ newExploreArr.slice(2) } parentClass="users--profile--posts" withOwnersName={true} />}
                  </div>
                </div>
              ) : (
                <div className="empty--posts--container flex-column">
                  <div className="empty--posts--inner mx-auto flex-column">
                    <div className="plus--icon--container flex-column">
                      <CgUnavailable className="plus__icon" />
                    </div>
                    <h3>No posts available</h3>
                    <p>
                      When there are photos and videos, they'll <br /> be right here.
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
const mapStateToProps = state => {
  return {
      modalsState: state[Consts.reducers.MODALS].modalsState,
      explore: state[Consts.reducers.USERSLIST].explore,
      isUsersListLoading: state[Consts.reducers.USERSLIST].isLoading,
  }
}
export default connect(mapStateToProps)(memo(Explore));
