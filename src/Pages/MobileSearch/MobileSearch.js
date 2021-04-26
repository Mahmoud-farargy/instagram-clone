import React, { Fragment, lazy, useContext,useRef, useEffect,useState} from "react";
import "./MobileSearch.scss";
import {RiSearchLine} from "react-icons/ri";
import Loader from "react-loader-spinner";
import {AppContext} from "../../Context";
import { TiDelete } from "react-icons/ti";
import SearchItem from "../../Components/SearchItem/SearchItem";
const Explore = lazy(() => import("../../Pages/Explore/Explore"));

const MobileSearch = () => {
    const {explore, searchUsers, searchInfo} = useContext(AppContext);
    const [searchVal, setSearchVal] = useState("");
    const _isMounted = useRef(null);

    useEffect(() => {
        if(_isMounted){
            if (searchVal && searchVal !== "") {
            searchUsers(searchVal, "regular");
          } else {
            setSearchVal("");
          }
        }
      }, [searchVal]);
    const clearSearchBox = () => {
        setSearchVal("");
    };
    useEffect(() => {
        
        return () => {
          _isMounted.current = false;
        }
    }, [])
    return (
        <Fragment>
            <div id="mobileSearch">
                <div className="desktop-comp">
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
            ) : null}

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
export default MobileSearch;