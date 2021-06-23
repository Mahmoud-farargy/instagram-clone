import React , { useRef, useEffect } from "react";
import Auxiliary from "../HOC/Auxiliary";
import { GoVerified } from "react-icons/go";
import { Avatar } from "@material-ui/core";
import { withBrowseUser } from "../../Components/HOC/withBrowseUser";
import PropTypes from "prop-types";

const SearchItem = (props) => {
  const { user, browseUser, closeSearchBox } = props;
  const _isMounted = useRef(true);
  useEffect(()=> () => _isMounted.current = false, []);
  const directTo = () => {
    browseUser(user?.uid,user?.userName).then(() => {
      if(_isMounted?.current){
          closeSearchBox(false);
      }
    }); 
  }
  return (
    <Auxiliary>
      <li
        className="search--result--item flex-row"
        role="none"
        onClick={() => directTo()}
      >
        <div className="search--item--inner flex-row">
          <Avatar
            src={user?.userAvatarUrl}
            className="search--user--img"
            alt={user?.userName}
            title={user?.userName}
          />
          <div className="search--item--info flex-column">
            <h5 className="user--search--name flex-row">
              {user?.userName}
              <span>
                {" "}
                {user?.isVerified && <GoVerified className="verified_icon" />}
              </span>
            </h5>
          </div>
        </div>
      </li>
    </Auxiliary>
  );
};

SearchItem.propTypes = {
  user: PropTypes.object.isRequired,
  browseUser: PropTypes.func.isRequired,
  closeSearchBox: PropTypes.func
}
export default withBrowseUser(SearchItem);
