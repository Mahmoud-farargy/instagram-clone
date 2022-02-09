import React, { Fragment, useState, useEffect, memo } from "react";
import "./HomeReels.scss";
import { auth } from "../../Config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Skeleton from "react-loading-skeleton";
import Loader from "react-loader-spinner";
import HomeReelItem from "./HomeReelItem/HomeReelItem";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";
import Carousel from "react-items-carousel";
import { connect } from "react-redux";
import * as Consts from "../../Utilities/Consts";

const HomeReels = ({ homeReels, isUsersListLoading, isReceivedDataLoading }) => {
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [, loading] = useAuthState(auth);
  const [newReelsArr, setReelsArr] = useState([]);
  const [itemsPerSide, setItemsPerSlide] = useState(6);
  const getRandom = (length) => {
    const newLength = homeReels.length < 0 || length < 0 ? 0 : length;
    if (newLength >= 0) {
      return Math.floor(Math.random() * newLength);
    }
  };
  useEffect(() => {
    const currWidth = +window.innerWidth || +document.documentElement.clientWidth;
    // Responsive reel items count
    if (currWidth >= 3000) {
      // Large Desktop
      setItemsPerSlide(8);
    } else if (currWidth >= 1366) {
      // Laptop
      setItemsPerSlide(7);
    } else if (currWidth >= 1024) {
      // Tablet
      setItemsPerSlide(6);
    } else if (currWidth >= 464) {
      // Mobile
      setItemsPerSlide(5);
    } else if (currWidth >= 350) {
      // Small Mobile
      setItemsPerSlide(4);
    } else if (currWidth >= 250) {
      // Smaller Mobile
      setItemsPerSlide(3);
    } else {
      // Less than usual
      setItemsPerSlide(2);
    }
  }, []);

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
      {(isReceivedDataLoading || loading || isUsersListLoading) ? (
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
      ) : newReelsArr.length > 0 ? (
        <section id="homeReels">
          <div className="home--reels--deck">
            <div className="home--reels--inner">
              <div className="home--reels--box flex-row">
                <ul className="home--reels--ul">
                  <Carousel
                    requestToChangeActive={setActiveItemIndex}
                    activeItemIndex={activeItemIndex}
                    numberOfCards={itemsPerSide}
                    infiniteLoop={false}
                    firstAndLastGutter={true}
                    enablePlaceholder={true}
                    gutter={4}
                    outsideChevron={false}
                    slidesToScroll={3}
                    chevronWidth={25}
                    placeholderItem={
                      <Loader
                        type="TailSpin"
                        color="var(--light-black)"
                        arialLabel="loading-indicator"
                        height={60}
                        width={60} />
                    }
                    classes={{ wrapper: "items--wrapper", itemsWrapper: "items--wrapper", itemsInnerWrapper: "items--wrapper" }}
                    rightChevron={<button aria-label="Scroll right" className="home--reel--right--arrow">
                      <IoIosArrowDroprightCircle />
                    </button>}
                    leftChevron={<button aria-label="Scroll left" className="home--reel--left--arrow">
                      <IoIosArrowDropleftCircle />
                    </button>}
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
      ): null}
    </Fragment>
  );
};
const mapStateToProps = state => {
  return {
      homeReels: state[Consts.reducers.USERSLIST].homeReels,
      isUsersListLoading: state[Consts.reducers.USERSLIST].isLoading,
  }
}
export default connect( mapStateToProps )(memo(HomeReels));