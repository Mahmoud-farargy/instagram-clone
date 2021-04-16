import React from "react";
import { withBrowseUser } from "../../../Components/HOC/withBrowseUser";

const MutualFriendsItem = (props) => <small title={props.item?.receiverName} onClick={(x)=> {props.browseUser(props.item?.receiverUid, props.item?.receiverName); x.stopPropagation()}} className="similar__followers__item"> {props.item?.receiverName}</small>
export default withBrowseUser(MutualFriendsItem);