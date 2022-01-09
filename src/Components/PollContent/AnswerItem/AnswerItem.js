import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { capFirstLetter } from "../../../Utilities/Utility";

const AnswerItem = ({ answer, handleVoting, postOwnerId, postId, percentage, voteState, uid, updateLikesNComments, iAmTheOwner, handlePostLoading}) => {
    const [ hasVoted, setVotingState ] = useState(false);
    const [ newPercentage, setPercentage ] = useState(0);
    const _isMounted = useRef(true);
    useEffect(() => () => _isMounted.current = false, []);
    useEffect(() => {
        answer.votes && setVotingState(answer.votes.some(el => el === uid));
    },[answer]);
    useEffect(() => {
        setPercentage(!isNaN(percentage) ? percentage : 0);
    },[ percentage ]);
    const isFunc = (func) => {
        return typeof func === "function";
    }
    const onAnswerClick = () => {
        const answerId = answer.id;
        isFunc(handlePostLoading) && handlePostLoading(true);
        handleVoting({ voteState: !hasVoted, postOwnerId, postId, answerId: answerId }).then(() => {
            if(_isMounted.current){
                isFunc(handlePostLoading) && updateLikesNComments({uid: postOwnerId, postID: postId});   
            }
        }).catch(() => {
            if(_isMounted.current){
                isFunc(handlePostLoading) && handlePostLoading(false);
            }
        });
    }

    return (
        <li onClick={() => onAnswerClick()} className={`${ hasVoted ? "selected--poll--answer" : "" } poll--content--answer flex-row`}>
            <p>{capFirstLetter(answer.text)}</p>
            { (iAmTheOwner || voteState) && <span className="poll__content__bar" style={{width: `${newPercentage}%`}}></span>}
            { (iAmTheOwner || voteState) && <span className="poll__content__percentage">{newPercentage}%</span>}
        </li>
    )
};
AnswerItem.propTypes = {
    answer: PropTypes.object.isRequired,
    handleVoting: PropTypes.func.isRequired,
    postOwnerId: PropTypes.string.isRequired,
    postId: PropTypes.string.isRequired,
    percentage: PropTypes.number.isRequired,
    updateLikesNComments: PropTypes.func,
    handlePostLoading: PropTypes.func
}

export default AnswerItem;