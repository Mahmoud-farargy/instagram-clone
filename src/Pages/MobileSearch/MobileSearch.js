import React, { Fragment, lazy, useContext, useRef, useEffect, useState, memo } from "react";
import "./MobileSearch.scss";
import { RiSearchLine } from "react-icons/ri";
import Loader from "react-loader-spinner";
import { AppContext } from "../../Context";
import { TiDelete } from "react-icons/ti";
import SearchItem from "../../Components/SearchItem/SearchItem";
import { BsMicFill } from "react-icons/bs";
import { debounce } from "../../Utilities/Debounce";
import { retry } from "../../Utilities/RetryImport";
import * as Consts from "../../Utilities/Consts";
import { connect } from "react-redux";

const Explore = lazy(() => retry(() => import("../../Pages/Explore/Explore")));

const MobileSearch = ({ explore }) => {
  const { searchUsers, searchInfo, notify, changeMainState } = useContext(AppContext);
  const [searchVal, setSearchVal] = useState("");
  const _isMounted = useRef(true);
  const timeIntervalId = useRef(null);

  useEffect(() => {
    if (_isMounted?.current) {
      if (searchVal && searchVal !== "") {
        (debounce(function () {
          searchUsers(searchVal, "regular");
        }, 900, timeIntervalId, false))();
      } else {
        clearSearchBox();
      }
    }
  }, [searchVal]);
  const clearSearchBox = () => {
    setSearchVal("");
    changeMainState("searchInfo", { results: [], loading: false });
  };
  useEffect(() => {
    return () => {
      _isMounted.current = false;
    }
  }, [])
  return (
    <Fragment>
      <div className="desktop-comp">
        <div id="mobileSearch">

          <div className="mobile--search--inner">
            {/* search */}
            <div className="mobile--search--box mobile-only">
              <div>
                <div className="search--bar--container">
                  <input
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    type="text"
                    className="search__input"
                    aria-label="search bar"
                    placeholder="Search"
                    autoCapitalize="none"
                  />
                  <span className="search__icon">
                    <RiSearchLine />
                  </span>
                  {searchInfo?.loading ? (
                    <span className="loading--search--box">
                      <Loader
                        type="Puff"
                        color="#919191"
                        height={19}
                        width={19}
                        arialLabel="loading-indicator"
                        timeout={5000}
                      />
                    </span>
                  ) : searchVal ? (
                    <span
                      onClick={() => clearSearchBox()}
                      className="clear--search--box"
                    >
                      <TiDelete />
                    </span>
                  ) : <span
                    onClick={() => notify("Voice search is on the way to mobile soon.", "info")}
                    className="clear--search--box voice__search__icon"
                  >
                        <BsMicFill />
                      </span>}

                  <div
                    style={{
                      display: searchVal ? "flex" : "none",
                      transition: "all 0.4s ease",
                      opacity: searchVal ? "1" : "0",
                    }}
                  >
                    <ul className="mobile--search--ul flex-column">
                      {searchInfo?.results && searchInfo?.results.length > 0 ? (
                        searchInfo?.results?.map((user, i) => {
                          return (
                            <SearchItem
                              key={user?.uid || i}
                              user={user}
                              closeSearchBox={clearSearchBox}
                            />
                          );
                        })
                      ) : (
                          <div className="empty--box flex-row">
                            <h4>No Results found</h4>
                          </div>
                        )}
                    </ul>

                  </div>
                </div>
              </div>
            </div>
            {/* Explore */}
            {
              explore && !searchVal &&
              <Explore />
            }
          </div>
        </div>
      </div>
    </Fragment>
  )
}
const mapStateToProps = state => {
  return {
      explore: state[Consts.reducers.USERSLIST].explore
  }
}
export default  connect( mapStateToProps )(memo(MobileSearch));