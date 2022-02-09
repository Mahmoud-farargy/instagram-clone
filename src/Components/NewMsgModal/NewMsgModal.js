import React, {useState, useEffect, useContext, useRef} from "react";
import { AppContext } from "../../Context";
import { IoIosArrowBack } from "react-icons/io";
import { trimText } from "../../Utilities/TrimText";
import { Avatar } from "@material-ui/core";
import { GoVerified } from "react-icons/go";
import { connect } from "react-redux";
import * as Consts from "../../Utilities/Consts";
import * as actionTypes from "../../Store/actions/actions";
import PropTypes from "prop-types";

const NewMsgModal = ({ closeModal, changeModalState, suggestionsList }) => {
    const { receivedData, initializeChatDialog, searchUsers, searchInfo, notify, changeMainState, handleSendingMessage } = useContext(AppContext);
    // --------------
    // REFS
    // ==============
    const radioCheck = useRef(null);
    const _isMounted = useRef(true);
    const timeouts = useRef(null);
    useEffect(() => {
        return () => {
          window.clearTimeout(timeouts?.current);
          _isMounted.current = false;
        }
    },[]);
    const [searchText, setSearchText] = useState("");
    const [newMsgData, setMsgData] = useState({
        messageText: "",
        sendTo: {},
      });
    const [isLoading, setLoading] = useState(false);
    const userChangeRadio = (c) => {
        setMsgData({
          ...newMsgData,
          sendTo: c
        });
      }
      useEffect(() => {
        if(_isMounted?.current){
          if(searchText && searchText !== ""){
            searchUsers(searchText, "regular");
          }
        }
      },[searchText]);
    
    const usersArr = searchText ? searchInfo?.results : suggestionsList;
    const commitMessage = () => {
        setLoading(true);
        // if(sendPostForm){

        // }else{
            if(Object.keys(newMsgData?.sendTo).length > 0 && newMsgData?.messageText){
                var {uid, userName, userAvatarUrl, isVerified} = newMsgData?.sendTo;
                
                initializeChatDialog(uid, userName, userAvatarUrl, isVerified).then(() => {
                  if(_isMounted?.current){
                            setLoading(false);
                            changeMainState("currentChat", { uid: uid,index: 0 }).then(() => {
                              if(_isMounted?.current){
                                handleSendingMessage({content: newMsgData?.messageText, uid: uid, type: "text", pathname: ""}).then(() => {
                                  if(_isMounted?.current){
                                      const newIndex = receivedData && receivedData.messages?.map(d => d.uid).indexOf(uid);
                                          changeMainState("currentChat",{uid, index: newIndex !== -1 ? newIndex : 0}).then(() => {
                                            if(_isMounted?.current){
                                              timeouts.current = setTimeout(() => {
                                                if(_isMounted?.current){
                                                  changeModalState("newMsg", false); 
                                                  closeModalFunc();
                                                  window.clearTimeout(timeouts?.current);
                                                }
                                              }, 300);
                                            }
                                          });
                                  }
                                }).catch(() => {
                                  _isMounted?.current && changeModalState("newMsg", false);
                                });
                              }
                            });
                      removeSelectedUser();
                  }
                       
                }).catch(() => {
                  if(_isMounted?.current){
                      setLoading(false);
                  }
                });
            }else{
                notify("User and message must be defined","error");
            }
        // }
    }
    const removeSelectedUser = () => {
        setMsgData({messageText: "", sendTo: {}});
        if(radioCheck && radioCheck.current){
            radioCheck.current.checked = false;
        }
      }
    const sendMsg = (c) => {
      c.preventDefault();
      commitMessage();
    }
    const closeModalFunc = () => {
      if(!isLoading){
          changeModalState("newMsg", false);
          typeof closeModal === "function" && closeModal();  
      }
    }
    return (
        <div className="new--msg--conainer usersModal--container flex-column">
              <div className="new--msg--inner usersModal--inner modalShow">
                <div className="usersModal--card">
                   <div className="new--msg--header flex-row">
                    <span className="new__msg__close" onClick={() => closeModalFunc()}><span className="desktop-only">&times;</span><IoIosArrowBack className="mobile-only" /> </span>
                    <span className="new__msg__title">New Message</span>
                    <div><button onClick={() => commitMessage()} disabled={(!newMsgData?.sendTo || !newMsgData?.messageText)} className={`msg__send__btn desktop-only ${(!newMsgData?.sendTo || !newMsgData?.messageText) && "disabled"}`} >{ isLoading ? "Sending..." : "Send"}</button></div>
                   </div>
                   <div className="new--msg--send--to flex-row">
                    <h4>To:</h4>
                   { Object.keys(newMsgData?.sendTo).length > 0 && <span className="new__msg__username flex-row">{newMsgData?.sendTo.userName}<span onClick={() => removeSelectedUser()} className="new__msg__del__name">&times;</span></span>}
                    <input autoFocus onChange={(x) => setSearchText(x.target.value)} value={searchText} autoComplete="off" spellCheck={false} name="query box" type="text" placeholder="Search.." className="new__msg__search"/> 
                   </div>                   
                    { Object.keys(newMsgData?.sendTo).length > 0 &&
                    <div className="new--msg--send--to flex-row" style={{borderTop: "none"}}>
                       <h4>Message body:</h4>
                      <form onSubmit={(c) => sendMsg(c)}>
                         <textarea autoFocus spellCheck={false} onChange={(q) => setMsgData({...newMsgData,messageText:q?.target?.value})} value={newMsgData?.messageText} name="message body" type="text" placeholder="Message.." className="new__msg__textarea__body"/> 
                      </form>
                    </div>
                     }
                   <div className="new--msg--body flex-column">
                     <h4 className="new__msg__sugg__title">Suggested</h4>
                     <div className="suggestions--list w-100 flex-column">
                        {usersArr && usersArr.length > 0 ?
                          <ul className="flex-column">
                            {
                             Array.from(new Set(usersArr.map((item) => item.uid))).map((id) => usersArr.find((el) => el.uid === id))
                             .filter((item) => (item?.uid !== receivedData?.uid)).slice(0,20)
                             .map((user, i) =>
                                  <label htmlFor={user?.uid} key={user?.uid + i} className="suggest--item--container">
                                      <li className="suggestion--item flex-row">
                                            <div  title={user?.userName} className="side--user--info flex-row">
                                                <Avatar src={user?.userAvatarUrl} alt={user?.userName} title={user?.userName}/>
                                                <span className="flex-column">
                                                      <h5 className="flex-row">{ user?.userName && trimText(user?.userName, 80)}{user?.isVerified ?  <span><GoVerified className="verified_icon"/></span> : null} </h5>  
                                                      <small>{user?.profileInfo?.name && trimText(user?.profileInfo?.name, 80)}</small>
                                                </span>                    
                                              </div>
                                              <input ref={radioCheck} onChange={() => userChangeRadio(user)} value={newMsgData?.sendTo?.uid || ""} checked={newMsgData?.sendTo?.uid  === user?.uid} type="radio" id={user?.uid} className="new__msg__radio" name="user" />
                                      </li> 
                                  </label>
                                )
                            }
                          </ul>
                              
                            : <div className="empty--box flex-row">
                              <h4>No Suggestions currently</h4>
                            </div>
                        }
                      </div>
                      <button onClick={() => commitMessage()} disabled={(!newMsgData?.sendTo || !newMsgData?.messageText)} className={`prof__btn__unfollowed msg_mobile_btn mobile-only ${(!newMsgData?.sendTo || !newMsgData?.messageText) && "disabled"}`} >{ isLoading ? "Sending..." : "Send"}</button>
                   </div>
                </div>
              </div>
            </div>
    )
}
NewMsgModal.propTypes = {
    sendPostForm: PropTypes.object,
    closeModal: PropTypes.func
}
NewMsgModal.defaultProps = {
    sendPostForm: {}
}
const mapDispatchToProps = dispatch => {
  return {
      changeModalState: (modalType, hasDataList, usersList, usersType) => dispatch({type: actionTypes.CHANGE_MODAL_STATE, payload: {modalType, hasDataList, usersList, usersType}})
  }
}
const mapStateToProps = state => {
  return {
      suggestionsList: state[Consts.reducers.USERSLIST].suggestionsList
  }
}
export default connect( mapStateToProps, mapDispatchToProps )(React.memo(NewMsgModal));