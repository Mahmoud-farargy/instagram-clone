import React, {useContext, useEffect, useState} from "react";
import Auxiliary from "../../Components/HOC/Auxiliary";
import "./Explore.scss";
import { AppContext } from "../../Context";
import { FaHeart } from "react-icons/fa";
import { FaComment } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../Config/firebase";

const Explore = () => {
    const { explore, changeMainState, changeModalState} = useContext(AppContext);
    const [newExploreArr, setExploreArr] = useState([]);
    const [,loading] = useAuthState(auth);
    const history = useHistory();
    const getRandom = (length) => {
        const newLength  = length < 0 ? 0 : length;
        if(newLength >= 0){
             return  Math.floor(Math.random() * newLength);
        }      
    };
    useEffect(() => {
        setExploreArr(
            explore && explore.length >0 && explore.map(posts => posts[getRandom(posts?.length)])
        )
        console.log(newExploreArr);
    },[]);
  
    const openPostModal = (postId, index) =>{
        console.log(postId, index);
        // changeMainState("currentPostIndex", { index: index, id: postId });
        // changeModalState("post", true);
    }

    const redirectToPost = (i, id) => {
        console.log(i, id);
    //     changeMainState("currentPostIndex", { index: i, id: id });
    //    history.push("/browse-post");
    };
    return(
        <Auxiliary>
            <section id="explore" className="explore-container flex-column">
                <div className="desktop-comp explore-inner flex-column">
                        {/* explore start */}
            <div id="usersProfile" className="users--profile--container ">
                {/* add another container in the first row */}
                {
                    (explore && explore.length > 0 && newExploreArr.length >= 1 && !loading) ? (
                        <div className="users--profile--posts" >
                            {newExploreArr.map((post, i) => {
                              return (
                                <div
                                  key={post?.id + i}
                                  className="profile--posts--container "
                                >
                                    {/* TODO: find another way to differentiate between mobile and desktop view functionally */}
                                  {/* desktop */}
                                  <div
                                    onClick={() => openPostModal(post?.id,i)}
                                    className="user--img--container desktop-only flex-column"
                                  >
                                   {
                                     post?.contentType === "image" ?  
                                      <img
                                      loading="lazy"
                                        style={{ width: "100%" }}
                                        className="users__profile__image"
                                        src={post?.contentURL}
                                        alt={`post #${i}`}
                                      />
                                      : post?.contentType === "video" ?
                                        <video className="users__profile__image" muted disabled autoPlay loop contextMenu="users__profile__image" onContextMenu={() => false}  src={post?.contentURL} />
                                      : <h4>Not found</h4>
                                   } 
                                   
                                    <div className="user--img--cover">
                                      <div className="flex-row">
                                        <span className="mr-3">
                                          <FaHeart /> {post?.likes?.people?.length.toLocaleString()}
                                        </span>
                                        <span>
                                          <FaComment />{" "}
                                          {post?.comments?.length && post?.comments?.length.toLocaleString()}{" "}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  {/* Mobile */}
                                  <div
                                    onClick={() => redirectToPost(i, post?.id)}
                                    className="user--img--container mobile-only flex-column"
                                  >
                                    {
                                     post?.contentType === "image" ?  
                                      <img
                                      loading="lazy"
                                        style={{ width: "100%" }}
                                        className="users__profile__image"
                                        src={post?.contentURL}
                                        alt={`post #${i}`}
                                      />
                                      : post?.contentType === "video" ?
                                        <video className="users__profile__image" muted autoPlay loop disabled onContextMenu={() => false} contextMenu="users__profile__image"  src={post?.contentURL} />
                                      : <h4>Not found</h4>
                                   } 
                                    <div className="user--img--cover">
                                      <div className="flex-row">
                                        <span className="mr-3">
                                          <FaHeart /> {post?.likes?.people?.length.toLocaleString()}
                                        </span>
                                        <span>
                                          <FaComment />{" "}
                                          {post?.comments && post?.comments.length?.toLocaleString()}{" "}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : loading ? (
                          <Skeleton
                            count={10}
                            height={250}
                            width={250}
                            className="mt-4 mr-4 mx-auto"
                          />
                        ) : (
                          <div className="empty--posts--container flex-column">
                            <div className="empty--posts--inner mx-auto flex-column">
                              <div className="plus--icon--container flex-column">
                                {/* <CgProfile className="plus__icon" /> */}
                              </div>
                              <h3>No posts yet</h3>
                              <p>
                                When you share photos and videos, they'll <br /> be appear on
                                your profile page
                              </p>

                              <span>Share your first photo or video</span>
                            </div>
                          </div>
                        )
                    
       }
        </div>
                        {/* explore end */}
                </div>
            </section>
        </Auxiliary>
    )
}

export default Explore;