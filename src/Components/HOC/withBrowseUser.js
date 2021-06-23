import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { AppContext } from "../../Context";

export const withBrowseUser = WrappedComponent => {
    class newComponent extends PureComponent {
      static contextType = AppContext;
      state={ isLoading: false}
      _isMounted = true;
      componentWillUnmount(){
        this._isMounted = false;
      }
       browseUser = (specialUid, name) =>{
        const { getUsersProfile , notify, uid} =  this.context;
        return new Promise((resolve, reject) => {
            this.setState({...this.state,isLoading: true});
            if (specialUid && name) {
                if(specialUid !== uid){
                    getUsersProfile(specialUid).then(()=>{
                      if(this._isMounted){
                        this.setState({...this.state,isLoading: false});
                        this.props.history.push(`/user_profile/${name}/${specialUid}`);
                        resolve();
                      }else{
                        reject();
                      }
                    }).catch((err) =>{
                      if(this._isMounted){
                        this.setState({...this.state,isLoading: false});
                        notify((err && err?.message) || "error has occurred. please try again later!", "error");
                      }
                      reject();
                    });
                }else{
                  this.props.history.push(`/profile`);
                  resolve();
                }
            }else{
              reject();
            }
        })
 
      }
      render(){
      
        return (
          <>
            {this._isMounted && this.state.isLoading && <div className="global__loading"><span className="global__loading__inner"></span></div>}
            <WrappedComponent {...this.props} browseUser={this.browseUser} />
          </>
        )
      }
    }
    return withRouter(newComponent);
}

withBrowseUser.propTypes = {
  WrappedComponent: PropTypes.elementType.isRequired
}