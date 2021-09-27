import React, { PureComponent, Fragment, lazy, Suspense } from "react";
import { AppContext } from "../../Context";
import "./AddNewPost.css";
import { withRouter } from "react-router-dom";
import { MdPermMedia } from "react-icons/md";
import InputForm from "../../Components/Generic/InpuForm/InputForm";
import {updateObject} from "../../Utilities/Utility";
import Files from "react-files";
import * as Consts from "../../Utilities/Consts";
import { retry } from "../../Utilities/RetryImport";
const CropMediaPhase = lazy(() => retry(() => import("./CropMediaPhase/CropMediaPhase")));
const FilterMediaPhase = lazy(() => retry(() => import("./FilterMediaPhase/FilterMediaPhase")));
const ShareMediaPhase = lazy(() => retry(() => import("./ShareMediaPhase/ShareMediaPhase")));

class AddNewPost extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      contentType: "",
      contentName: "",
      method: "Post",
      contentPreview: ""
    };
    this._isMounted = true;
    this.storeItem = this.storeItem.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.changeContentPreview = this.changeContentPreview.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }
  static contextType = AppContext;
  componentDidMount = () => {
    if (this._isMounted) {
      const { changeMainState } = this.context;
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
      uploadedItem: uploadedItem,
      contentPreview: URL.createObjectURL(uploadedItem),
      contentType: this.state.method.toLowerCase() === Consts.Reel ? "video" : itemType,
    });
  }
  handleFileChange(w){
    const { receivedData, notify } = this.context;
    this.props.setCurrentPhase(1);
    let uploadedItem = w[0];
    const fileName = `${Math.random()}${uploadedItem?.name}`;
    const itemType = /image/g.test(uploadedItem?.type) ? "image": /video/g.test(uploadedItem?.type) ? "video" : "audio";
    if(receivedData?.uid){
        //post
        if(this.state.method.toLowerCase() === Consts.Post){
          if (
                /(image|video|audio)/g.test(uploadedItem?.type) &&
                uploadedItem.size <= 12378523
              ) {
                if (uploadedItem.name.split("").length < 300) {
                  this.storeItem({ uploadedItem, fileName, itemType });
                } else {
                  notify(
                    `The name of the ${itemType} is too long. it should not exceed 300 characters`,
                    "info"
                  );
                }
              } else {
                notify(
                  `The ${itemType} should should not exceed the size of 12MB.`,
                  "info"
                );
              }
        }else if(this.state.method.toLowerCase() === Consts.Reel) {
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
      this.props.history.push("/auth");
    }    
  };
  onInputChange(val, name){
    this.setState(updateObject(this.state,{[name]: val}));
  }

  render() {
    const { notify } = this.context;
    const { currentPhase, setCurrentPhase } = this.props;
    return (
      <Fragment>
        <section id="upload" className="post--uploading--container flex-column">
       {
          this.state.contentType ?
                  (<div className="post--uploading--crop">
                    {
                      (this.state.contentType === "image") ?
                      <Suspense fallback={<div><div className="global__loading"><span className="global__loading__inner"></span></div></div>}>
                        {
                          currentPhase === 1 ?
                              <CropMediaPhase setCurrentPhase={setCurrentPhase} contentType = {this.state.contentType} changeContentPreview={this.changeContentPreview} contentPreview = {this.state.contentPreview} />
                          :
                          currentPhase === 2 ?
                              <FilterMediaPhase setCurrentPhase={setCurrentPhase} changeContentPreview={this.changeContentPreview} contentPreview = {this.state.contentPreview}/>
                          : 
                          currentPhase === 3 ?
                              <ShareMediaPhase contentName={this.state.contentName} uploadedItem={this.state.uploadedItem} context={this.context} method={this.state.method} setCurrentPhase={setCurrentPhase} contentType = {this.state.contentType} changeContentPreview={this.changeContentPreview} contentPreview = {this.state.contentPreview}/>
                          : null
                        }
                        </Suspense>
                        :
                        <ShareMediaPhase contentName={this.state.contentName} uploadedItem={this.state.uploadedItem} context={this.context} method={this.state.method} setCurrentPhase={setCurrentPhase} contentType = {this.state.contentType} changeContentPreview={this.changeContentPreview} contentPreview = {this.state.contentPreview}/>
                     }
                
                  </div>)
                      :
            this.state.contentType === "" ?
              <div className=" post--uploading--inner flex-column">
                <div className="post--uploading--card flex-column">
                  <div className="showing--upladed--content">
                    <div>
                        <div>
                          
                          <Files
                              data-cy="upload_file"
                              className="files__dropzone"
                              accepts={this.state.method.toLowerCase() === Consts.Post? ['image/*','video/*','audio/*'] : this.state.method.toLowerCase() === Consts.Reel ?  ['video/*'] : null}
                              maxFileSize={12378523}
                              minFileSize={0}
                              clickable
                              onChange={(w) => this.handleFileChange(w)}
                              multiple={false}
                              maxFiles={1}
                              onError={(error)=> notify(error.message, "error")}
                              dragActiveClassName="files-dropzone-active"
                            >  <span className="upload__files__icon"><MdPermMedia /></span>
                            {`${this.state.method.toLowerCase() === Consts.Post ? "Drop an image, video or audio here to upload " : this.state.method.toLowerCase() === Consts.Reel ?  "Drop a video here to upload" : "Drop a file here or click to upload"}`}
                            <br />
                            <p className="mt-2 text--size--2">(Should not exceed 12MB)</p>
                            </Files>
                          <InputForm
                              type="select"
                              options={["Post", "Reel"]}
                              val={this.state.method}
                              changeInput={this.onInputChange}
                              name="method"
                              label="Type"
                            />

                        </div>
                        
                    
                    </div>
                    
                  </div>
                  {/* xxxxxxx */}
                </div>
              </div>
              : null
       } 
         
        </section>
      </Fragment>
    );
  }
}
export default withRouter(AddNewPost);
