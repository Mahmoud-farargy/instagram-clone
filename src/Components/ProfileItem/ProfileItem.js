import React, { Fragment } from "react";
import { FaHeart } from "react-icons/fa";
import { FaComment } from "react-icons/fa";
import PropTypes from "prop-types";
import igAudioImg from "../../Assets/ig-audio.jpeg";

const ProfileItem = ({ post, openPost, index, className, withOwnersName, isSavedPost , onLoadingFail }) => {
  return (
        <Fragment>
      <div className={`profile--posts--container ${className}`}>
        <div
          onClick={() => openPost(post?.id, index, post?.postOwnerId)}
          className="user--img--container flex-column"
        >
          {post?.contentType === "image" ? (
            <img
              loading="lazy"
              className="users__profile__image"
              src={post?.contentURL}
              alt={`post #${index}`}
              onError={() => isSavedPost && onLoadingFail(post?.postOwnerId, post?.id)}
            />
          ) : post?.contentType === "video" ? (
            <video
              className="users__profile__image"
              muted
              disabled
              autoPlay
              loop
              contextMenu="users__profile__image"
              onContextMenu={() => false}
              src={post?.contentURL}
              onError={() => isSavedPost && onLoadingFail(post?.postOwnerId, post?.id)}
            />
          ) : post?.contentType === "audio" ?
            <img className="users__profile__image" src={igAudioImg} loading="lazy" alt={`post #${index}`} />
            : (
            <h4>Not found</h4>
          )}

          <div className="user--img--cover flex-column fadeEffect">
            {
              !isSavedPost &&
              <div className="flex-row">
              <span className="mr-3">
                <FaHeart /> {post?.likes?.people?.length.toLocaleString()}
              </span>
              <span>
                <FaComment />{" "}
                {post?.comments?.length &&
                  post?.comments?.length.toLocaleString()}{" "}
              </span>

            </div>
            }
            {
                withOwnersName &&
                <span className="owner--post--name mt-1">
                  By {post?.userName}
                </span>
            }
          </div>
        </div>
      </div>
    </Fragment>
  )

};
ProfileItem.propTypes = {
  post: PropTypes.object.isRequired,
  openPost: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  withOwnersName: PropTypes.bool,
  isSavedPost: PropTypes.bool,
  onLoadingFail: PropTypes.func
};
export default ProfileItem;
