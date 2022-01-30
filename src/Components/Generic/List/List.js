import React, { Fragment, useRef, useState, useEffect, useCallback, cloneElement } from 'react';
import loadingGif from "../../../Assets/loadingGif.gif";

function List({ children, list, parentClass, childrenClass, parentId, increaseBy = 5 ,intervalTime = 1100, areHomePosts = false }) {
    // refs
    const _isMounted = useRef(true);
    const timeouts = useRef(null);
    const observer = useRef(null);
    // STATE
    const [currLimit, setCurrLimit] = useState(increaseBy);
    const [hasMore, setLimit] = useState(true);
    const [isLoading, setLoading] = useState({
        loadingMoreItems: false,
        openingPost: false
    });
    // ----x--State---x-----
    const finalLimit = list?.length || null;

    useEffect(() => () => {
        window.clearTimeout(timeouts?.current);
        _isMounted.current = false;
    }, []);
    const increasePosts = useCallback(() => {
        if (hasMore && _isMounted.current) {
            setLoading({ ...isLoading, loadingMoreItems: true });
            if (currLimit >= finalLimit) setLimit(false);
            timeouts.current = setTimeout(() => {
                if (_isMounted.current) {
                    setLoading({ ...isLoading, loadingMoreItems: false });
                    setCurrLimit(currLimit + increaseBy);
                    window.clearTimeout(timeouts?.current);
                }
            }, intervalTime);
        }
    },[finalLimit, isLoading, currLimit, intervalTime, hasMore]);
    const lastPostElementRef = useCallback(node => {
        if (observer?.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(enteries => {
            if (enteries[0].isIntersecting && hasMore && !isLoading?.loadingMoreItems) {
                increasePosts();
            }
        });
        if (node) observer.current.observe(node);
    }, [hasMore, increasePosts, isLoading]);

    return (
        <Fragment>
            <div id={parentId || ""} className={`${parentClass || ""}`}>
                {
                    list?.slice(0, currLimit)?.map((post, index) => {
                            const homePostsProps =  {
                                userName: post.userName  || "",
                                caption : post.caption || "",
                                contentType: post.contentType ||  "",
                                contentURL: post.contentURL || "",
                                contentName: post.contentName ||  "",
                                comments: post.comments ||  [],
                                likes: post.likes ||  {},
                                pollData: post.pollData ||  {},
                                postDate: post.date ||  {},
                                location: post.location || "",
                                postId: post.id ||  "",
                                postOwnerId: post.postOwnerId ||  "",
                                userAvatar: post.userAvatarUrl ||  "",
                                youtubeData: post.youtubeData ||  {},
                                songInfo: post.songInfo ||  {},
                                isVerified: post.isVerified ||  false,
                                disableComments: post.disableComments || false
                            }
                            if (currLimit === index + 1) {
                                return post &&
                                    <div className={`${childrenClass || ""} full--width`} key={post.id || index} ref={lastPostElementRef}>
                                        {cloneElement(children, {
                                            post,
                                            index,
                                            ...(areHomePosts) && homePostsProps
                                            })}
                                    </div>
                            } else {
                                return post && <div className={`${childrenClass || ""} full--width`}  key={post.id || index}>
                                    {cloneElement(children, {
                                        post,
                                        index,
                                        ...(areHomePosts) && homePostsProps
                                        })}
                                </div>
                            } 
                    })
                }
            </div>

            {
                parentClass !== "explore--upper--row" &&
                <div className="increase--posts--count flex-column">
                    <img
                        className={`${!isLoading?.loadingMoreItems && "hide__loading__animation"}`}
                        loading="lazy"
                        src={loadingGif}
                        alt="Loading..."
                    />
                </div>
            }
        </Fragment>

    )
}

List.defaultProps = {
    list: [],
    parentClass: "",
    childrenClass: "",
    parentId: "",
    increaseBy: 5,
    intervalTime: 1100,
    areHomePosts: false
}
export default List;