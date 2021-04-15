import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { AppContext } from "../../Context";

export const withBrowseUser = WrappedComponent => {    
    class newComponent extends PureComponent {
      static contextType = AppContext;
       browseUser = (specialUid, name) =>{
        const { getUsersProfile , notify} =  this.context;
       if (specialUid && name) {
              getUsersProfile(specialUid).then(()=>{
              this.props.history.push(`/user-profile/${name}`);
              }).catch((err) =>{
                notify((err && err.message) || "error has occurred. please try again later!", "error");
              });
            
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