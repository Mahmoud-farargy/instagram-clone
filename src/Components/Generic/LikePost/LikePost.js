import React, { Fragment, memo } from "react";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import PropTypes from "prop-types";

const LikePost = ({isPostLiked, handleCurrLikes}) => {
    return (
        <Fragment>
            {!isPostLiked ? (
                <span data-cy="like" className="post--like--icon" onClick={() => handleCurrLikes(true)}>
                <FiHeart />
                </span>
            ) : (
                <span
                data-cy="like"
                onClick={() => handleCurrLikes(false)}
                style={{
                    animation: isPostLiked
                    ? "boundHeart 0.5s forwards ease"
                    : null,
                }}
                className="liked__heart"
                >
                <FaHeart />
                </span>
            )
            }   
        </Fragment>

    )
}
LikePost.propType = {
    isPostLiked: PropTypes.bool.isRequired,
    handleCurrLikes: PropTypes.func.isRequired
}
export default memo(LikePost);