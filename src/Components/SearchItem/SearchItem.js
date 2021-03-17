import React from "react";
import Auxiliary from "../HOC/Auxiliary";
import { GoVerified } from "react-icons/go";
import { Avatar } from "@material-ui/core";
const SearchItem = (props) => {
  const { user, browseUser } = props;
  return (
    <Auxiliary>
      <li
        className="search--result--item flex-row"
        role="none"
        onClick={() => browseUser(user?.uid,user?.userName)}
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
export default SearchItem;
