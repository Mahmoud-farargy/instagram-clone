import React, { useState, useContext, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Auxiliary from "../../../Components/HOC/Auxiliary";
import AnswerItem from "./answerItem/answerItem";
import { TiPlus } from "react-icons/ti";
import * as Consts from "../../../Utilities/Consts";
import { lowerCaseString } from "../../../Utilities/Utility";
import { AppContext } from "../../../Context";
import InputForm from "../../../Components/Generic/InpuForm/InputForm";
import "./PollQuizPhase.scss";

const PollQuizPhase = () => {
    const { addPost, notify, receivedData, uid, generateNewId } = useContext(AppContext);
    const history = useHistory();
    const _isMounted = useRef(true);
    const defaultAnswers = [
        {id: "fohwefoiwfhfuyjko", value: ""},
        {id: "oiwhyg89eygiugkjm", value: ""},
    ]
    useEffect(() => {
        return () => {
            _isMounted.current = false;
        }  
    }, []);
    const limits = Object.freeze({
        answersLimit: 5,
        quizCharsLimit: 200,
        answerCharsLimit: 65
    });
    const [isPublishable, setValidation] = useState(false);
    const [areAllAnswersfilled, setAnswersFillingState] = useState(false);
    const [formState, setFormState] = useState({
        question: "",
        answers: [
            ...defaultAnswers
        ],
        isSubmitted: false,
        isLoading: false,
        addAnswerClicked: false
    });

    useEffect(() => {
        if(formState.answers && formState.question){
            const answersFilled = formState.answers.every(item => (item?.value !== ""));
            setValidation(formState.question && answersFilled );
            setAnswersFillingState(answersFilled);
        }
    }, [formState]);
    const onInputChange = (val, name, payload) => {
        if(lowerCaseString(name) === "answers" && payload?.id){
            const { id= "" } = payload;
            const index = formState.answers.map(k => k.id).indexOf(id);

            if(index !== -1){
                let answersCopy = JSON.parse(JSON.stringify(formState.answers));
                answersCopy[index] = {...answersCopy[index],value: val};
                setFormState({
                    ...formState,
                    answers: answersCopy
                });   
            }

        }else{
            setFormState({
                ...formState,
                [name] : val
            });
        }
    } 
    const onAddingAnAnswer = () => {
        const answersLength = formState.answers.length;
        if(answersLength < limits.answersLimit){
            if(areAllAnswersfilled){
                setFormState({
                    ...formState,
                    answers: [...formState.answers, {id: generateNewId(), value: ""}],
                    addAnswerClicked: false
                });

            }else{
                setFormState({...formState, addAnswerClicked: true});
            }
        }
    }
    const onCloseClick = ({id}) => {
        
        if(id && formState.answers.length > 1){
                let newAnswersObj = JSON.parse(JSON.stringify(formState.answers));
                const elIdx = formState.answers.map(el => el.id).indexOf(id);
                if(elIdx >= 0){
                    newAnswersObj.splice(elIdx, 1);
                    setFormState({
                        ...formState,
                        answers: newAnswersObj
                    })    
                }

        }
    }
    const onPublishing = (e) => { 
        e && e.preventDefault();
        const answersLength = formState.answers.length;
        if(answersLength <= limits.answersLimit && answersLength >= 1){
            if(isPublishable){
                if(formState.question.length <= limits.quizCharsLimit){
                    setFormState({ ...formState, isLoading: true });
                    const addedPost = {
                        caption: "",
                        id: generateNewId(),
                        contentType: Consts.Poll,
                        contentURL: "",
                        pollData: {
                            question: formState.question,
                            answers: formState.answers.map(answerEl => {
                                return {
                                    text: answerEl.value,
                                    id: answerEl.id,
                                    votes: []
                                }
                            })
                        },
                        comments: [],
                        date: new Date(),
                        likes: { people: [] },
                        userName: receivedData?.userName,
                        location: "",
                        postOwnerId: uid,
                        userAvatarUrl: receivedData?.userAvatarUrl,
                        contentName: false,
                        songInfo: {},
                        disableComments: false
                    }
                    addPost(addedPost, Consts.Post).then(() => {
                        if (_isMounted.current) {
                            notify("Poll question has been added");
                            setFormState(
                                {
                                    ...formState,
                                    question: "",
                                    answers: {...defaultAnswers},
                                    isSubmitted: false,
                                    isLoading: false,
                                });
                            history.push("/");
                        }
                    }).catch(() => {
                        if (_isMounted.current) {
                            setFormState({ ...formState, isLoading: false });
                            notify("Failed to make a poll. Please try again later!", "error");
                        }
                    });   
                }else{
                    notify("The question should not exceed 150 characters.", "error");
                }
            }else{
                notify("All fields must be filled.", "error");
            }    
        }else{
            notify(`Answers should not exceed ${limits.answersLimit} and not be less than 2.`, "error");
        }

    }
    return (
        <Auxiliary>
            <div id="pollQuiz">
                <div className="poll--quiz--inner">
                    <p>Create a multiple-choice poll and ask members to vote. Votes will be anonymous.</p>
                    <form className="poll--quiz--form" onSubmit={(e) => onPublishing(e)}>
                        {/* question */}
                        <InputForm
                                autoFocus={true}
                                required={true}
                                type="textarea"
                                name="question"
                                label="Poll question"
                                val={formState.question}
                                changeInput={onInputChange}
                                submitted={formState.isSubmitted}
                                maxLength={limits.quizCharsLimit}
                                hideLabel={true}
                         />
                        <h5 className="poll__header">Poll choices</h5>
                            {
                                formState.answers?.length > 0 &&
                                formState.answers.map((answer, idx) => (
                                    <AnswerItem key={answer.id || idx} item={answer} onInputChange={onInputChange} onCloseClick={onCloseClick} isSubmitted={formState.isSubmitted} answerCharsLimit={limits.answerCharsLimit} index={idx}/>
                                ))
                            } 
                            {(!areAllAnswersfilled && formState.addAnswerClicked) && <p className="text-danger">Fields above should be filled first.</p>}
                            <div className={`${formState.answers.length >= limits.answersLimit ? "disabled" : ""} add__more__answers__btn flex-row`} disabled={formState.answers.length >= limits.answersLimit} onClick={() => onAddingAnAnswer()}><TiPlus /> <span>Add another choice</span></div>
                        <div className="poll--footer">
                            <input type="submit" disabled={(!isPublishable || formState.isLoading)} className={`${(!isPublishable || formState.isLoading) ? "disabled" : ""} profile__btn primary__btn`} value={formState.isLoading ? "Publishing..." : "Publish"} />
                        </div>
                    </form>
                </div>
            </div>
        </Auxiliary>
    )
};

export default PollQuizPhase;