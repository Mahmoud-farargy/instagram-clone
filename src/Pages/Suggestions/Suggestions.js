import React, { useEffect, useRef, useState, memo } from "react";
import Auxiliary from "../../Components/HOC/Auxiliary";
import "./Suggestions.scss";
import SuggestionItem from "../../Components/SuggestItem/SuggestItem";
import { GOU } from "../../Utilities/GetOnlineUsers";
import { withinPeriod } from "../../Utilities/WithinPeriod";
import PropTypes from "prop-types";
import * as Consts from "../../Utilities/Consts";

const Suggestions = (props) => {
    const _isMounted = useRef(true);
    const { suggestionsList, uid, changeMainState, changeModalState, receivedData, loadingState } = props;
    const [onlineList, setOnlineList] = useState([]);
    const [newUsers, setNewUsers] = useState([]);
    const [upcomingBirthdays, setBirthdays] = useState([]);
    useEffect(() => {
            GOU(uid).then((k) => {
                if(_isMounted?.current){
                    setOnlineList(k);
                }
            });
            suggestionsList && setNewUsers(suggestionsList.filter(user => (withinPeriod({date: user.profileInfo?.accountCreationDate?.seconds, period:604800000}))));
            suggestionsList && setBirthdays(suggestionsList.filter(user => (new Date().getMonth() + 1 === new Date(user?.profileInfo?.birthday).getMonth() + 1) && (new Date().getDate() <= new Date(user?.profileInfo?.birthday).getDate())));
            changeMainState("currentPage", "Suggestions");
        
        return () => _isMounted.current = false;
    }, [uid])
    const showUsers = (type, list) => {
        (type === "new" || type === "birthdays") && list && list.length > 0 && changeModalState("users",true, list, type === "new"? Consts.NEWUSERS : Consts.BIRTHDAYS);
    }
    return (
        <Auxiliary>
            <div id="suggestionsPage">
                <div className="desktop-comp ">
                    <div className="suggestions--p--inner">
                        <button className={`profile__btn prof__btn__unfollowed ${newUsers?.length <= 0 && "disabled"}`} onClick={() => newUsers?.length > 0 && showUsers("new", newUsers)}>New members this week ({newUsers?.length})</button><br />
                        <button className={`profile__btn prof__btn__unfollowed  ${upcomingBirthdays?.length <= 0 && "disabled"}`} onClick={() => upcomingBirthdays?.length > 0 && showUsers("birthdays", upcomingBirthdays )}>Upcoming birthdays this month ({upcomingBirthdays?.length})</button>
                        <h4 className="mt-3">Suggested</h4>
                        <h5 className="online__title">Online users ({onlineList?.length})</h5>
                        
                        <ul className="suggestions--p--ul">
                            {
                                suggestionsList && suggestionsList.length > 0 ?
                                 suggestionsList?.filter(user => user.uid !== uid )?.map((user,i) => (
                                    user && Object.keys(user).length > 0 &&
                                    <SuggestionItem
                                        key={i}
                                        userName={user?.userName}
                                        isVerified={user?.isVerified}
                                        userUid={user?.uid}
                                        userAvatarUrl={user?.userAvatarUrl}
                                        creationDate={user?.profileInfo?.accountCreationDate ? user?.profileInfo?.accountCreationDate : ""}
                                        followers={user?.followers}
                                        isOnline={onlineList?.some(c => c.uid === user?.uid)}
                                        user={user}
                                        receivedData={receivedData}
                                        loadingState={loadingState}
                                    />
                                    ))
                                    :
                                    <h6>No suggestions yet</h6>
                            }
                           
                        </ul>
                       
                    </div>
                </div>
            </div>
        </Auxiliary>
    )
}
Suggestions.propTypes = {
    suggestionsList: PropTypes.array.isRequired,
    uid: PropTypes.string.isRequired,
    changeMainState: PropTypes.func.isRequired,
    changeModalState: PropTypes.func.isRequired,
    receivedData: PropTypes.object.isRequired,
    loadingState: PropTypes.bool.isRequired
}
export default memo(Suggestions);