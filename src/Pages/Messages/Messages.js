import React, {Component} from "react";
import Auxiliary from "../../Components/HOC/Auxiliary";
import {AppContext} from "../../Context";
import {Avatar} from "@material-ui/core";
import {BsPencilSquare} from "react-icons/bs";
import TruncateMarkup from "react-truncate";
import {FiSend,FiInfo} from "react-icons/fi";
import {VscSmiley} from "react-icons/vsc";
import {RiMenu4Fill} from "react-icons/ri";
import {MdClose} from "react-icons/md";
import { updateObject } from "../../Utilities/Utility";

import $ from "jquery";

class Messages extends Component{
    constructor(props){
        super(props);
        this.autoScroll = React.createRef();
        this.state={
            inputValue: "",
            loadedChatLog: [],
            currentUserIndex: 0,
            openSidedrawer: false,
            showEmojis: false
        }
        
    }
    
    static contextType = AppContext;
    
    componentDidMount=()=>{
        $(document).ready(()=>{
            $("#messagesUL li").on("click", function(){
                $("#messagesUL li").each((i, item)=>{
                    $(item).removeClass("active-msg");
                })
                $(this).addClass("active-msg");
            });           
        });
         
            
    }
    componentDidUpdate=(prevProps,prevState)=>{
        if(prevProps.messages !== this.props.messages){
            
            if(this.autoScroll.scrollIntoView){
               this.autoScroll.scrollIntoView({ behavior: "smooth" }); 
               this.setState(updateObject(this.state, {showEmojis: false}))
            }
            
        }
        if(prevState.currentUserIndex != this.state.currentUserIndex){
            this.autoScroll.scrollIntoViewIfNeeded(); 
        }
    }
    submitMessage(v){
        v.preventDefault();
        
        const {handleSendingMessage, receivedData} = this.context;
        const currUser = receivedData?.messages[this.state.currentUserIndex];
        
        handleSendingMessage(this.state.inputValue, currUser?.uid, "text");
        
        this.setState({
            ...this.state,
            inputValue: ""
        })
    }
    viewUsersMessages(currentUID, loadedIndex){
       const {receivedData} = this.context;
       const {messages} = receivedData;
        // const getUserById=()=>{
        //     let currIndex;
        //     messages.filter((item,i)=>{
        //         currIndex = i;
        //         console.log(item);
        //         return item.uid === currentUID;
        //     });
        //     return currIndex;
        // }
       
       this.setState({
           ...this.state,
           loadedChatLog: messages[loadedIndex], 
           currentUserIndex: loadedIndex
       })
   }
   selectEmoji=(emojiText)=>{
        this.setState({
            ...this.state,
            inputValue: this.state.inputValue + emojiText
        })
   }
    render(){
        const {receivedData} = this.context;
        const {messages} = receivedData;
        const msg = messages ? messages[this.state.currentUserIndex] : "";
        return(
            <Auxiliary>
            <section id="messages" className="messages--container">
                <div className="desktop-comp">

                        <div className="messages--desktop--card flex-row">
                            {/* users side */}
                            <div className="messages--users--side desktop-only flex-column">
                                <div className="users--side--header flex-row">
                                    <span className="space__between">
                                        <h4>Direct</h4>
                                        <BsPencilSquare className="pen__logo"/>
                                    </span>
                                    
                                </div>
                                <div className="messages--top--nav flex-row">
                                    <div className="space__between">
                                        <h5>private</h5>
                                        <h5>general</h5>
                                    </div>
                                    
                                    
                                </div>
                                <div className="messages--view--users">
                                    <ul id="messagesUL">
                                    {
                                        messages?.length >=1 ?
                                        messages?.map((user,index)=>{
                                            return(
                                                //Desktop
                                                <li className="messages--user  flex-row" key={user.uid +index} onClick={()=> {this.viewUsersMessages(user?.uid, index); this.setState({currentUserIndex: index})}} >
                                                    <Avatar src={user?.receiversAvatarUrl} />
                                                    <div className="messages--user--info space__between">
                                                        <div style={{flex:1,width:"100%"}}>
                                                            <p><TruncateMarkup line={1} ellipsis="..">{user?.userName}</TruncateMarkup> </p>
                                                            <span className="last__message"><TruncateMarkup line={1} ellipsis="..">{user.chatLog.length >=1 ?  user.chatLog[user.chatLog?.length-1].textMsg : null}</TruncateMarkup></span>
                                                        </div>
                                                        <p className="messages__user__date">{user.chatLog.length >=1 ?  new Date(user.chatLog[user.chatLog?.length-1].date.seconds* 1000).toLocaleString() : null}</p>
                                                    </div>
                                                </li>
                                            )
                                        })
                                        :
                                        <h4 style={{fontSize:"14px", fontWeight:"600", textAlign:"center"}}>Start messaging people from the pen button above. Users will be here</h4>

                                    }
                                        
                                    </ul>
                                </div>
                            </div>
                            {/* messages side */}
                        <div className="messages--side">
                            <div className="mobile--msgs--menu mobile-only" >
                              {
                                  !this.state.openSidedrawer ?
                                  <RiMenu4Fill onClick={()=> this.setState({openSidedrawer: true})}/>
                                  : 
                                  <MdClose onClick={()=> this.setState({openSidedrawer: false})}/>
                              }  
                                
                            </div>
                           {
                               this.state.openSidedrawer ?
                                <div className="backdrop mobile-only" onClick={()=> this.setState({openSidedrawer: false})}></div>
                            : null
                           }
                        
                           <div style={{
                               transform: this.state.openSidedrawer ? "translate(0)":"translate(200vw)",
                               transition: "all 0.5s linear",
                               opacity: this.state.openSidedrawer ? "1" :"0"
                           }} id="mobileChat" className="mobile--users--sidedrawer"> {/*mobile */}
                                    <div className="messages--users--side mobile-only flex-column">
                                        <div className="users--side--header flex-row">
                                            <span className="space__between">
                                                <h4>Direct</h4>
                                            </span>
                                            
                                        </div>
                                        <div className="messages--top--nav flex-row">
                                            <div className="space__between">
                                                <h5>private</h5>
                                                <h5>general</h5>
                                            </div>
                                            
                                            
                                        </div>
                                        <div className="messages--view--users">
                                            <ul id="messagesUL">
                                            {
                                                messages?.length >=1 ?
                                                messages?.map((user,index)=>{
                                                    return(
                                                        <li className="messages--user  flex-row" key={user.uid +index} onClick={()=> {this.viewUsersMessages(user?.uid, index); this.setState({currentUserIndex: index, openSidedrawer: false})}} >
                                                            <Avatar src={user?.receiversAvatarUrl} />
                                                            <div className="messages--user--info space__between">
                                                                <div style={{flex:1,width:"100%"}}>
                                                                    <p><TruncateMarkup line={1} ellipsis="..">{user?.userName}</TruncateMarkup> </p>
                                                                    <span className="last__message"><TruncateMarkup line={1} ellipsis="..">{user.chatLog.length >=1 ?  user.chatLog[user.chatLog?.length-1].textMsg : null}</TruncateMarkup></span>
                                                                </div>
                                                                <p className="messages__user__date">{user.chatLog.length >=1 ?  new Date(user.chatLog[user.chatLog?.length-1].date.seconds* 1000).toLocaleString() : null}</p>
                                                            </div>
                                                        </li>                                            
                                                    )
                                                })
                                                :
                                                <h4 style={{fontSize:"14px", fontWeight:"600", textAlign:"center"}}>Start messaging people from the pen button above. Users will be here</h4>

                                            }
                                                
                                            </ul>
                                        </div>
                            </div>
                            </div>
                            
                          {
                             this.state.loadedChatLog < 1  ?
                                   <div className="messages--empty--container flex-column">
                                        {/* if there is no messages */} {/* when loading messages */}
                                           
                                                <div className="messages--side--inner flex-column">
                                                    <div><FiSend className="messages__send__logo"/></div>
                                                    <h3>Your Messages</h3>
                                                    <p>Send private photos and messages to a friend or group.</p>
                                                    <button>Send message</button>
                                                </div>
                                        </div>
                                    :
                                    <div className="messages--chatlog--container">
                                        <div className="messages--chatbox--header flex-row">
                                        {/* -- header */}
                                            <Avatar src={msg?.userAvatarUrl} />
                                            <div className="messages--user--info space__between">
                                                            <p><TruncateMarkup line={1} ellipsis="..">{msg?.userName}</TruncateMarkup> </p>
                                                            <div className="desktop-only"><FiInfo /></div>
                                            </div>
                                        {/* -- */}
                                        </div>
                                        <div className="messages--chatbox--body">
                                            {
                                                msg?.chatLog?.map((message, index) => {
                                                    return(
                                                        <div key={message?.uid + index} className="message--outer">
                                                            <span ref={(el)=> this.autoScroll = el}></span>
                                                            <div className={message?.uid === receivedData?.uid ? "sender flex-column" : "receiver"}>
                                                                <div className="message--text">
                                                                    <span>{message?.textMsg}</span>
                                                                   
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                    )
                                                })
                                            }
                                        </div>
                                {
                                    this.state.showEmojis ?
                                       <div style={{
                                           opacity: this.state.showEmojis ? "1" :"0",
                                           transition: 'all 0.5s ease'
                                       }} className="chat--emojis--box flex-row">
                                            <span onClick={()=> this.selectEmoji("😍 ")}>😍</span>
                                            <span onClick={()=> this.selectEmoji("😂 ")}>😂</span>
                                            <span onClick={()=> this.selectEmoji("😄 ")}>😄</span>
                                            <span onClick={()=> this.selectEmoji("😊 ")}>😊</span>
                                            <span onClick={()=> this.selectEmoji("😘 ")}>😘</span>
                                            <span onClick={()=> this.selectEmoji("😁 ")}>😁</span>
                                            <span onClick={()=> this.selectEmoji("😢 ")}>😢</span>
                                            <span onClick={()=> this.selectEmoji("😎 ")}>😎</span>
                                            <span onClick={()=> this.selectEmoji("😋 ")}>😋</span>
                                            <span onClick={()=> this.selectEmoji("😜 ")}>😜</span>
                                            <span onClick={()=> this.selectEmoji("😫 ")}>😫</span>
                                        </div>
                                        : null
                                } 
                                        <div className="messages--bottom--form flex-row">
                                             <form onSubmit={(v)=> this.submitMessage(v)} className="flex-row">
                                                 <VscSmiley onClick={()=> this.setState({showEmojis: !this.state.showEmojis})} className="smiley__icon" />
                                                <input onChange={(e) => this.setState({inputValue: e.target.value})} value={this.state.inputValue} className="message__input" placeholder="Message..." />
                                                {
                                                    this.state.inputValue ?
                                                    <input type="submit" value="Send" /> 
                                                    : null
                                                }
                                            </form>
                                        </div>
                                    </div>
                                        
                                } 
                                </div>
                              
                        </div>
                    </div>
                </section>
           </Auxiliary>
        )
    }
    
}

export default Messages;