import React, { Fragment, useContext, useState, useEffect, memo } from "react";
import { AppContext } from "../../Context";
import "./HomeReels.scss";
import { auth } from "../../Config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Skeleton from "react-loading-skeleton";
import HomeReelItem from "./HomeReelItem/HomeReelItem";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";
import Carousel from "react-multi-carousel";

const HomeReels = () => {
  const context = useContext(AppContext);
  const { homeReels, loadingState } = context;
  const [, loading] = useAuthState(auth);
  const [newReelsArr, setReelsArr] = useState([]);
  const getRandom = (length) => {
    const newLength = homeReels.length < 0 || length < 0 ? 0 : length;
    if (newLength >= 0) {
      return Math.floor(Math.random() * newLength);
    }
  };
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 8,
      slidesToSlide: 3, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 6,
      slidesToSlide: 2, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 5,
      slidesToSlide: 3, // optional, default to 1.
    },
    smallMobile: {
      breakpoint: { max: 340, min: 0 },
      items: 3,
      slidesToSlide: 2, // optional, default to 1.
    },
    extraSmallMobile: {
      breakpoint: { max: 240, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };
  useEffect(() => {
    if (homeReels && homeReels.length > 0) {
      function shuffleReels(array) {
        var j, x, i;
        for (i = array.length - 1; i > 0; i--) {
          j = Math.floor(Math.random() * (i + 1));
          x = array[i];
          array[i] = array[j];
          array[j] = x;
          return array || [];
        }
      }
      const arr = shuffleReels(
        homeReels?.map((reels) => {
          if (reels && reels?.length > 0) {
            const randomGroup = reels?.[getRandom(reels?.length)];
            return {
              ...randomGroup?.reelItems?.[
                Math.floor(
                  Math.random() *
                    (randomGroup?.reelItems?.length > 0
                      ? randomGroup?.reelItems?.length
                      : 0)
                )
              ],
              groupId: randomGroup?.id,
            };
          } else {
            return [];
          }
        })
      );
      setReelsArr(arr || []);
    }
  }, [homeReels]);
  return (
    <Fragment>
      {(!loading || !loadingState?.suggList) && newReelsArr.length > 0 ? (
        <section id="homeReels">
          <div className="home--reels--deck">
            <div className="home--reels--inner">
              <div className="home--reels--box flex-row">
                <ul className="home--reels--ul">
                  <Carousel
                    swipeable={false}
                    draggable={false}
                    responsive={responsive}
                    ssr={true} // means to render carousel on server-side.
                    infinite={false}
                    customRightArrow={
                      <button className="home--reel--right--arrow">
                        <IoIosArrowDroprightCircle />
                      </button>
                    }
                    customLeftArrow={
                      <button className="home--reel--left--arrow">
                        <IoIosArrowDropleftCircle />
                      </button>
                    }
                    keyBoardControl={true}
                    customTransition="all .6"
                    transitionDuration={500}
                    // containerClass="carousel-container"
                    // dotListClass="custom-dot-list-style"
                    itemClass="reel--carousel--item"
                  >
                    {newReelsArr.map((reel, i) => (
                      <HomeReelItem key={reel.id + i} reel={reel} />
                    ))}
                  </Carousel>
                </ul>
              </div>
            </div>
          </div>
        </section>
      ) : (loading || loadingState?.suggList) && newReelsArr.length <= 0 ? (
        <div id="homeReels">
          <div className="home--reels--inner">
            <div className="home--reels--box flex-row">
              <ul className="home--reels--ul flex-row">
                <li className="flex-column">
                  <Skeleton
                    count={7}
                    height={62}
                    width={62}
                    circle={true}
                    className="ml-4"
                  />
                  <Skeleton
                    count={7}
                    height={7}
                    width={62}
                    className="ml-4 mt-2"
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </Fragment>
  );
};

export default memo(HomeReels);