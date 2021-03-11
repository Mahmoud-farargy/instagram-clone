import React,{PureComponent, Fragment} from "react";
// http://localhost:3000/home
import {db, auth, storage} from "../../Config/firebase";
import {AppContext} from "../../Context";
import "./AddNewPost.css";
import {withRouter} from "react-router-dom";
import {Button, LinearProgress} from "@material-ui/core";
// import Skeleton from '@material-ui/lab/Skeleton';  //npm install @material-ui/lab

class AddNewPost extends PureComponent{
    
    state={
        posts: [{caption: "", id: "",contentType: "" , contentURL: "", comments: [], date: "", likes: [], userName: "", location: "" , uid: ""}],
        insertedCaption: "",
        progressBarPercentage: 0,
        uploading: false,
        postingPhase: true,
        contentType: "",
        contentURL: "",
        contentName: "",
        location: ""
    }
    static contextType = AppContext;
    componentDidMount=()=>{
     this.context.changeMainState("currentPage","New Post");
      this.setState({
        ...this.state,
        postingPhase: true
      })
    }
    componentDidUpdate=()=>{
        const {receivedData} = this.context;
        if(receivedData?.posts !== this.state.posts){
            this.setState({
              ...this.state,
                posts:  receivedData?.posts
            }) 
          
        }
        // console.log(this.props.location, this.props.history);
        // if(this.props.location.pathname !== "/add-post" && this.state.postingPhase){
        //   console.log("path has changed");
        // }
        
        // auth.onAuthStateChanged(user =>{
        //     db.collection("users").doc(user?.uid).get().then(data=>{
        //               this.setState({
        //                  ...this.state,
        //                   posts:    data.data().posts
        //               })
        //              //  console.log(data.data().messages[randomId].message);
        //     })
        // });
        
    }
    
    
    generateNewId =() =>{
      
        let char1 = "G";
        let char2 = "j";
        let char3 = "k";
        let char4 = "M";
        let char5 = "N";
        let char6 = "Z";
        var charRandom =()=>{
          return Math.floor((Math.random() *6 )+1);
        }
        for(let i = 0; i<5 ; i++){
          charRandom();//calls the "charRandom" function repeatedly 6 time, each time a new character will be created.
          switch (charRandom()){ //determines which new char will be created for each variable
            case 1:
              char1 = "A";
              break;
            case 2:
              char2 = "B"
              break;
            case 3:
              char3 = "C"
              break;
            case 4:
              char4 = "D"
              break;
            case 5:
              char5 = "E"
              break;
            default:
              char6 = "F"
          }
        };

        const numRandom=()=>{
          return char1 + char2 + char3 + Math.random() *9999 +1 + char4 + char5 + char6 ;
        }
        
        return numRandom();
    }  
    resetState(){
      this.setState({
               ...this.state,
              insertedCaption: "",
              progressBarPercentage: 0,
              uploading: false,
              postingPhase: false,
              contentType: "",
              contentURL: "",
              location: "",
              contentName: ""
        })
    }

    onCancel(){
      this.context.deleteContentFromFB(this.state.contentName);
      this.resetState();
    }
    onSubmitPost(x){
        x.preventDefault();

          let {isUserOnline, receivedData, updatedReceivedData , uid} = this.context;
        
          if(isUserOnline){//adds post
              if(this.state.insertedCaption !== ""){
                  if(this.state.contentName !== ""){
                      this.state.posts.unshift({caption: this.state.insertedCaption, id: this.generateNewId(),contentType: this.state.contentType , contentURL: this.state.contentURL, comments: [] , date: new Date(), likes: {people : []}, userName: receivedData?.userName, location: this.state.location , postOwnerId: uid, userAvatarUrl: receivedData?.userAvatarUrl, contentName: this.state.contentName} );

                    auth.onAuthStateChanged(user =>{
                        db.collection("users").doc(user?.uid).update({
                                posts: this.state.posts
                        }).then(()=>{
                          updatedReceivedData();
                          this.props.history.push("/");
                          this.resetState();
                        })
                    })
                  }else{
                    alert("Content should be inserted");
                  }
                
              }else{
                alert("Caption should be included");
              }
              
          }
          
          
      }
    handleFileChange=(w)=>{
      let uploadedItem  = w.target.files[0];  
      const metadata ={
        contentType : uploadedItem !== "" ? uploadedItem?.type : null
      }
      if(/(image|video)/g.test(metadata.contentType) && uploadedItem.size <= 12378523){
          const uploadContent = storage.ref(`content/${uploadedItem.name}`).put(uploadedItem, metadata);
        uploadContent.on("state_changed", (snapshot)=>{
          //Progress function .. 
          const progress  = Math.round(snapshot.bytesTransferred /  snapshot.totalBytes ) * 100;
          this.setState({
            ...this.state,
            uploading: true,
            progressBarPercentage: progress
          })
          // console.log(uploadContent, progress, timestamp);
        },(error) =>{
          //Error function..
          alert(error.message);
          this.resetState();
        },
        ()=>{
          // Complete function..
          storage.ref("content").child(uploadedItem.name).getDownloadURL().then( url =>{
            //post content on db
              this.setState({
                ...this.state,
                contentName: uploadedItem.name,
                uploading: false,
                progressBarPercentage: 0,
                contentURL: url,
                contentType: /image/g.test(metadata.contentType) ? "image" : "video"
              })
              uploadedItem =  ""; /*<<changed this (check..)*/
          })
        }
        );
      }else{
        alert("Please choose an image or video that doesn't exceed the size of 12MB.")
      }
      
      
    }

    
    render(){
        return(
            <Fragment>
                <section id="upload" className="post--uploading--container flex-column">
                <div className="desktop-comp post--uploading--inner flex-column"> 
                  <h5 className="app__titles">Add a Post</h5>
                    <div className="post--uploading--card flex-column">
                          <div className="showing--upladed--content">
                              {
                                this.state.uploading ?
                                // <Skeleton variant="rect" width={210} height={118} />
                                  <div className="uploading__in__progress flex-column">
                                    <h4>Uploading...</h4>
                                  </div>
                                
                                :
                                this.state.contentType === "image" ?
                                  <img src={this.state.contentURL} alt="" />
                                : this.state.contentType === "video" ?
                                  <video src={this.state.contentURL} controls> </video>
                                : null
                              }
                          </div>
                          <form onSubmit={(x)=> this.onSubmitPost(x)} >
                                {
                                  this.state.uploading ?
                                  <div className="my-4">
                                    <LinearProgress variant="buffer" value={this.state.progressBarPercentage} valueBuffer={0} />
                                  </div>
                                    
                                    : null
                                }
                                {  !this.state.uploading ?
                                      <input type="file" accept="image/*,video/*" onChange={(w)=> this.handleFileChange(w)} />
                                  : null
                                } 
                                  
                              {
                                !this.state.uploading ?
                                  <div>
                                    <textarea required type="text" placeholder="Enter a caption..." value={this.state.insertedCaption} onChange={(e)=> this.setState({insertedCaption: e.target.value})} />
                                    <input type="text" placeholder="Location"  value={this.state.location} onChange={(e)=> this.setState({location: e.target.value})} />
                                     {
                                       this.state.contentType !== "" ?
                                        <Button onClick={()=> this.onCancel()} variant="contained" >Cancel</Button>
                                       : null
                                     } 
                                      <Button type="submit" variant="contained" color="primary">Post</Button>
                                  </div>
                                : null
                              }
                            
                                  
                          </form>
                      </div> 
                    </div>                
                </section>
            </Fragment>
        )
    }
}
export default withRouter(AddNewPost);