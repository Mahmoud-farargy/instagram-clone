import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { AppContext } from "../../Context";

export const withBrowseUser = WrappedComponent => {
    class newComponent extends PureComponent {
      static contextType = AppContext;
      _isMounted = true;
      componentWillUnmount(){
        this._isMounted = false;
      }
       browseUser = (specialUid, name) =>{
        const { getUsersProfile , notify, uid} =  this.context;
          if (specialUid && name) {
              if(specialUid !== uid){
                  getUsersProfile(specialUid).then(()=>{
                    if(this._isMounted){
                      this.props.history.push(`/user_profile/${name}/${specialUid}`);
                    }
                  }).catch((err) =>{
                    if(this._isMounted){
                       notify((err && err.message) || "error has occurred. please try again later!", "error");
                    }
                  });
                
              }else{
                this.props.history.push(`/profile`);
              }
          }
      }
      render(){
      
        return <WrappedComponent {...this.props} browseUser={this.browseUser} />
      }
    }
    return withRouter(newComponent);
}

withBrowseUser.propTypes = {
  WrappedComponent: PropTypes.elementType.isRequired
}