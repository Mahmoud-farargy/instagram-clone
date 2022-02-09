import * as actionTypes from "./actions";
import {db} from "../../Config/firebase";
import * as Consts from "../../Utilities/Consts";
import { withinPeriod } from "../../Utilities/WithinPeriod";
import { toast } from "react-toastify";

const updateUserList = ({...payload}) => {
    return {
        type: actionTypes.UPDATE_USERS_LIST,
        data: payload
    }
}


export const updateSuggestionsListAsync = () => {
    let collectedData = [];
    return (dispatch, getState) => {
    dispatch({type: actionTypes.UPDATE_LOADING_STATE, newState: true});
    const usersListState = getState()[Consts.reducers.USERSLIST];
    const receivedData = usersListState?.myData;
    const UID = usersListState?.uid || receivedData?.uid;
  
        return new Promise((resolve, reject) => {
                db.collection(Consts.USERS)
                .limit(1000)
                .get()
                .then((query) => {
                    query.forEach((user) => {
                        const data = user.data();
                        collectedData.unshift(data);
                    });
                    collectedData = Array.from(
                        new Set(collectedData.map((itemId) => itemId.uid))
                      ).map((ID) => collectedData.find((el) => el.uid === ID));
                    // SUGGESTIONS DATA
                        let suggestList = Array.from(new Set(collectedData?.map((itemId) => itemId.uid)))
                        .map((ID) => collectedData?.find((el) => el.uid === ID))
                        .filter(
                            (p) =>
                            (receivedData?.blockList?.length > 0
                                ? !receivedData?.blockList?.some((k) =>
                                    k?.blockedUid.includes(p?.uid)
                                )
                                : p) &&
                            (receivedData?.profileInfo?.professionalAcc?.suggNotFollowed ? (!receivedData?.following?.some(usr => usr?.receiverUid === p?.uid)) : true) &&
                            (p?.blockList?.length > 0
                                ? !p?.blockList.some(
                                    (k) => k?.blockedUid === UID
                                )
                                : p) &&
                                (p?.profileInfo && p?.profileInfo?.professionalAcc ? (p?.profileInfo?.professionalAcc?.suggested) : true)
                        );
                        // EXPLORE DATA
                        let explorePosts = Array.from(new Set(collectedData?.map((itemId) => itemId.uid)))
                                .map((ID) => collectedData?.find((el) => el.uid === ID))
                                .filter((items) =>
                                (items?.uid !== UID && items?.posts && items?.posts?.length > 0) &&
                                (items?.profileInfo?.professionalAcc?.private ? (receivedData?.following?.some(el => el.receiverUid === items?.uid)) : true) &&
                                (receivedData?.blockList?.length > 0
                                ? !receivedData?.blockList?.some((k) =>
                                    k?.blockedUid.includes(items?.uid)
                                    )
                                : items) &&
                                (items?.blockList?.length > 0
                                ? !items?.blockList.some(
                                    (k) => k?.blockedUid === UID
                                    )
                                : items)
                                ).map(x => x.posts);
                        // HOME FEED DATA
                        let homeFeedArr = Array.from(new Set(collectedData?.map((itemId) => itemId.uid)))
                        .map((ID) => collectedData?.find((el) => el.uid === ID))
                        .filter((items) =>
                        (items?.uid !==  UID && items?.posts && items?.posts?.length > 0) &&
                        receivedData?.following?.some( user => user?.receiverUid === items?.uid) &&
                        (receivedData?.blockList?.length > 0
                        ? !receivedData?.blockList?.some((k) =>
                            k?.blockedUid.includes(items?.uid)
                            )
                        : items) &&
                        (items?.blockList?.length > 0
                        ? !items?.blockList.some(
                            (k) => k?.blockedUid === UID
                            )
                        : items)
                        ).map(x => x.posts)?.flat(Infinity)?.filter(post => withinPeriod({ date: post?.date?.seconds, period: 5259600000, min: 0 }));
                        //HOME REELS DATA
                        let homeReelsArr = Array.from(new Set(collectedData?.map((itemId) => itemId.uid)))
                        .map((ID) => collectedData?.find((el) => el.uid === ID))
                        .filter((items) =>
                        (items?.uid !==  UID && items?.reels && items?.reels?.length > 0) &&
                        (receivedData?.profileInfo?.professionalAcc?.reelsForFollowing ? (receivedData?.following?.some( user => user?.receiverUid === items?.uid)) : true) &&
                        (items?.profileInfo?.professionalAcc?.private ? (receivedData?.following?.some(el => el.receiverUid === items?.uid)) : true) &&
                        (receivedData?.blockList?.length > 0
                        ? !receivedData?.blockList?.some((k) =>
                            k?.blockedUid.includes(items?.uid)
                            )
                        : items) &&
                        (items?.blockList?.length > 0
                        ? !items?.blockList.some(
                            (k) => k?.blockedUid === UID
                            )
                        : items)
                        ).map(x => x.reels);
                        dispatch(updateUserList({
                            isLoading: false,
                            suggestionsList: suggestList,
                            explore: explorePosts,
                            homeReels: homeReelsArr,
                            homeFeed: homeFeedArr
                        }));
                        resolve();
                }).catch((err) => {
                    reject();
                    dispatch({type: actionTypes.UPDATE_LOADING_STATE, newState: false});
                    const notiSettings = {
                        position: "top-left",
                        autoClose: 3000,
                        closeOnClick: true
                    }
                    toast.success((err?.message || "An error occurred"), notiSettings);
                });
        })
    };
}