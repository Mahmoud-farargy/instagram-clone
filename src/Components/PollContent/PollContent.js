import React, { Fragment, useEffect, useState } from "react";
import AnswerItem from "./AnswerItem/AnswerItem";
import { capFirstLetter } from "../../Utilities/Utility";
import "./PollContent.scss";

const PollContent = ({pollData, handleVoting, postOwnerId, postId, uid, updateLikesNComments, handlePostLoading }) => {
    const { question = "", answers= {} } = pollData;
    const [ votesCounts, setVotesCounts ] = useState(0);
    const [ percentages, setPercentages ] = useState([]);
    const [ voteState, setVoteState] = useState("");
    const [ iAmTheOwner, setVoteOwnership ] = useState(false);
    useEffect(() => {
        const answersLength = answers.length;
        if(answersLength > 0){
            let tempCounter = 0;
            for(let i = 0; i< answersLength; i++){
                const currAnswer = answers[i];
                if(currAnswer.votes){
                    tempCounter += currAnswer.votes.length;
                }
            }
            setVoteState(answers.some(el => el.votes.some(item => item === uid)));
            setVotesCounts(+tempCounter);
            const percentageArr = answers.map(ansItem => Math.round((ansItem.votes?.length) *100 / (tempCounter)));
            setPercentages(percentageArr);
        }
    }, [answers]);
    useEffect(() => {
        setVoteOwnership(postOwnerId === uid);
    }, [postOwnerId]);

    return Object.keys(pollData)?.length > 0 && (
        <Fragment>
            <div id="pollContent">
                <h5 className="poll__content__quiz">{capFirstLetter(question)}</h5>
                {
                    answers?.length > 0 &&
                    <>  
                    <ul className="poll--content--answers">
                        {answers.map((answer, idx) => {
                            return answer &&(
                                <AnswerItem key={answer.id || idx} answer={answer} uid={uid} postOwnerId={postOwnerId} postId={postId} percentage={Number(percentages[idx])} voteState={voteState} updateLikesNComments= {updateLikesNComments} iAmTheOwner={iAmTheOwner} handlePostLoading={handlePostLoading} handleVoting={handleVoting}/>
                            )
                        })}    
                    </ul>

                    <small className="poll__content__votes_counts">{votesCounts.toLocaleString()} {`${votesCounts > 1 ? "votes": "vote"}`}</small>
                    </>
                }
            </div>
        </Fragment>
    )
};

export default PollContent;