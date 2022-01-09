import React, { PureComponent, Fragment, lazy, Suspense } from "react";
import { AppContext } from "../../Context";
import "./AddNewPost.css";
import { withRouter } from "react-router-dom";
import { MdPermMedia } from "react-icons/md";
import { CgPoll } from "react-icons/cg";
import { FiTwitter, FiYoutube } from "react-icons/fi";
import InputForm from "../../Components/Generic/InpuForm/InputForm";
import { updateObject, lowerCaseString } from "../../Utilities/Utility";
import Files from "react-files";
import * as Consts from "../../Utilities/Consts";
import { retry } from "../../Utilities/RetryImport";

const CropMediaPhase = lazy(() => retry(() => import("./CropMediaPhase/CropMediaPhase")));
const FilterMediaPhase = lazy(() => retry(() => import("./FilterMediaPhase/FilterMediaPhase")));
const ShareMediaPhase = lazy(() => retry(() => import("./ShareMediaPhase/ShareMediaPhase")));
const TweetPhase = lazy(() => retry(() => import("./TweetPhase/TweetPhase")));
const PollQuiz = lazy(() => retry(() => import("./PollQuizPhase/PollQuizPhase")));
const YoutubePhase = lazy(() => retry(() => import("./YoutubePhase/YoutubePhase")));

class AddNewPost extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      contentType: "",
      contentName: "",
      method: {value: Consts.Post, title: "post"},
      contentPreview: "",
      postMethodOptions: {
        post: {value: Consts.Post, title: "post"},
        reel: {value: Consts.Reel, title: "reel"},
        tweet: {value: Consts.Tweet, title: "tweet"},
        poll: {value: Consts.Poll, title: "poll question"},
        youtube: {value: Consts.YoutubeVid, title: "youTube video"}
      }
    };
    this._isMounted = true;
    this.storeItem = this.storeItem.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.changeContentPreview = this.changeContentPreview.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }
  static contextType = AppContext;
  componentDidMount = () => {
    const { _isMounted, context } = this;
    if (_isMounted) {
      const { changeMainState } = context;
      changeMainState("currentPage", "Add New");
    }
  };
  componentWillUnmount = () => {
    this._isMounted = false;
  };

  changeContentPreview(val){
    this.setState({...this.state, contentPreview: val });
  } 
  storeItem({ uploadedItem, fileName, itemType }) {
    uploadedItem && this.setState({
      ...this.state,
      contentName: fileName,
      uploadedItem,
      contentPreview: URL.createObjectURL(uploadedItem),
      contentType: lowerCaseString(this.state.method.value) === Consts.Reel ? Consts.Video : itemType,
    });
  }
  handleFileChange(w){
    const { context, props, state } = this;
    const { receivedData, notify } = context;
    props.setCurrentPhase({index:1, title: "post"});
    let uploadedItem = w[0];
    const fileName = `${Math.random()}${uploadedItem?.name}`;
    const itemType = /image/g.test(uploadedItem?.type) ? Consts.Image: /video/g.test(uploadedItem?.type) ? Consts.Video : Consts.Audio;
    if(receivedData?.uid){
        //post
        if(lowerCaseString(state.method.value) === Consts.Post){
          if (
                /(image|video|audio)/g.test(uploadedItem?.type) &&
                uploadedItem.size <= 12378523
              ) {
                if (uploadedItem.name.split("").length < 400) {
                  this.storeItem({ uploadedItem, fileName, itemType });
                } else {
                  notify(
                    `The name of the ${itemType} is too long. it should not exceed 400 characters`,
                    "info"
                  );
                }
              } else {
                notify(
                  `The ${itemType} should should not exceed the size of 12MB.`,
                  "info"
                );
              }
        }else if(lowerCaseString(state.method.value) === Consts.Reel) {
          // reel
            if (
              /video/g.test(uploadedItem?.type) &&
              uploadedItem.size <= 12378523
            ) {
              if (uploadedItem.name.split("").length <= 250) {
                  this.storeItem({ uploadedItem, fileName, itemType });
              }
          } else {
            notify(
              "Please choose a video that doesn't exceed the size of 12MB.",
              "info"
            );
          }
        }
    }else{
      notify("You are not properly logged in. Please login and try again.","error");
      props.history.push("/auth");
    }    
  };
  onInputChange(val, name){
    if(val && name){
        if(lowerCaseString(name) === "method" && this.state.postMethodOptions.hasOwnProperty(val)){
          this.setState({...this.state,
            method: {value:val, title: this.state.postMethodOptions[val].title},
            ...((lowerCaseString(val) === Consts.Tweet || lowerCaseString(val) === Consts.Poll || lowerCaseString(val) === Consts.YoutubeVid) && {contentType: lowerCaseString(val)})
          });
        }else{
          this.setState(updateObject(this.state,{[name]: {value:val, ...this.state[name]}}));
        }
    }   
  }
  componentDidUpdate(prevProps){
    if(prevProps.currentPhase.index !== this.props.currentPhase.index){
      if(this.props.currentPhase.index === 0){
        this.setState({...this.state, contentPreview: "", contentType: "", contentName: "", method: {value: "post", title: "post"}});
      }
    }
  }
  render() {
    const renderedContentInput = () => {
      const changeCurrPhase = ({index, title}) =>{
          typeof index === "number" && this.props.setCurrentPhase({index, title});
      }
        switch (lowerCaseString(this.state.method.value)){
          case Consts.Post:
          case Consts.Reel: {
              return (
                  <Files
                  data-cy="upload_file"
                  className="files__dropzone"
                  accepts={lowerCaseString(this.state.method.value) === Consts.Post? ['image/*','video/*','audio/*'] : lowerCaseString(this.state.method.value) === Consts.Reel ?  ['video/*'] : null}
                  maxFileSize={12378523}
                  minFileSize={0}
                  clickable
                  onChange={(w) => this.handleFileChange(w)}
                  multiple={false}
                  maxFiles={1}
                  onError={(error)=> notify(error.message, "error")}
                  dragActiveClassName="files-dropzone-active"
                >  <span className="upload__files__icon"><MdPermMedia /></span>
                {`${lowerCaseString(this.state.method.value) === Consts.Post ? "Drop an image, video or audio here to upload " : lowerCaseString(this.state.method.value) === Consts.Reel ?  "Drop a video here to upload" : "Drop a file here or click to upload"}`}
                <br />
                <p className="mt-2 text--size--2">(Should not exceed 12MB)</p>
                </Files>
              )
          }
          case Consts.Tweet: {
            return (<button title="Tweet your thoughts to others" onClick={() => changeCurrPhase({index: 4, title: this.state.contentType})} className="py-1 profile__btn primary__btn flex-row"><FiTwitter /><span>Write a Tweet</span></button>)
          }
          case Consts.Poll: {
            return (<button title="Encourage people to participate in a poll" onClick={() =>changeCurrPhase({index: 4, title: this.state.contentType})} className="py-1 profile__btn primary__btn flex-row"><CgPoll /><span>Make a poll question</span></button>)
          }
          case Consts.YoutubeVid: {
            return (<button title="Share your favorite YouTube Videos as posts" onClick={() => changeCurrPhase({index: 4, title: this.state.contentType})} className="py-1 profile__btn primary__btn flex-row"><FiYoutube /><span>Post a Youtube Video</span></button>)
          }
          default: {
            return(<span>Not available</span>)
          }
        }
    };
    const renderedContentType = () => {
        switch(lowerCaseString(this.state.contentType)){
          case Consts.Image:{
            return(
               <Suspense fallback={<div><div className="global__loading"><span className="global__loading__inner"></span></div></div>}>
                  {
                    currentPhase.index === 1 ?
                        <CropMediaPhase setCurrentPhase={setCurrentPhase} contentType = {this.state.contentType} changeContentPreview={this.changeContentPreview} contentPreview = {this.state.contentPreview} />
                    :
                    currentPhase.index === 2 ?
                        <FilterMediaPhase setCurrentPhase={setCurrentPhase} changeContentPreview={this.changeContentPreview} contentPreview = {this.state.contentPreview}/>
                    : 
                    currentPhase.index === 3 ?
                        <ShareMediaPhase contentName={this.state.contentName} uploadedItem={this.state.uploadedItem} context={this.context} method={this.state.method.value} setCurrentPhase={setCurrentPhase} contentType = {this.state.contentType} changeContentPreview={this.changeContentPreview} contentPreview = {this.state.contentPreview}/>
                    : null
                  }
                </Suspense>  
            )
          }
          case Consts.Video:
          case Consts.Audio: {
            return( <ShareMediaPhase contentName={this.state.contentName} uploadedItem={this.state.uploadedItem} context={this.context} method={this.state.method.value} setCurrentPhase={setCurrentPhase} contentType = {this.state.contentType} changeContentPreview={this.changeContentPreview} contentPreview = {this.state.contentPreview}/>)
          }
          case Consts.Tweet: {
            return (<TweetPhase />)
          }
          case Consts.Poll: {
            return (<PollQuiz />)
          }
          case Consts.YoutubeVid: {
            return (<YoutubePhase />)
          }
          default: {
            return(<span>Not available</span>)
          }
        }
    }
    const { notify } = this.context;
    const { currentPhase, setCurrentPhase } = this.props;
    return (
      <Fragment>
        <section id="upload" className="post--uploading--container flex-column">
       {           
        (currentPhase.index === 0 || this.state.contentType === "") ?
              <div className=" post--uploading--inner flex-column">
                <div className="post--uploading--card flex-column">
                  <div className="showing--upladed--content">
                    <div>
                        <div>
                          <div className="content--input">
                            {renderedContentInput()}
                          </div>

                          <InputForm
                              type="select"
                              options={Object.keys(this.state.postMethodOptions)?.length > 0 ? Object.values(this.state.postMethodOptions).map(option => option.value): []}
                              titles={Object.keys(this.state.postMethodOptions)?.length > 0 ? Object.values(this.state.postMethodOptions).map(option => option.title): []}
                              val={this.state.method.value}
                              changeInput={this.onInputChange}
                              name="method"
                              label="Type"
                              className="new_post_select__content"
                            />

                        </div>
                    </div>
                  </div>
                  {/* xxxxxxx */}
                </div>
              </div>
            : 
          (currentPhase.index > 0 && currentPhase.index <= 4) && this.state.contentType &&
                  (<div className="post--uploading--crop">
                    {renderedContentType()}
                  </div>)
       } 
         
        </section>
      </Fragment>
    );
  }
}
export default withRouter(AddNewPost);
