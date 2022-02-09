import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { AppContext } from "../../Context";

export const withBrowseUser = WrappedComponent => {
    class newComponent extends PureComponent {
      static contextType = AppContext;
      constructor(){
        super();
        this.state={ isLoading: false};
        this.memoizedBrowseUser = this.browseUser.bind(this);
        this._isMounted = true;
      }
      componentWillUnmount(){
        this._isMounted = false;
      }
       browseUser = (specialUid, name) =>{
        return new Promise((resolve, reject) => {
          const { getUsersProfile , notify, uid} =  this.context;
            this.setState({...this.state,isLoading: true});
            if (specialUid && name) {
                if(specialUid !== uid){
                    getUsersProfile(specialUid).then(()=>{
                      resolve();
                      if(this._isMounted){
                        this.setState({...this.state,isLoading: false});
                        this.props.history.push(`/user_profile/${name}/${specialUid}`);
                      }
                    }).catch((err) =>{
                      reject();
                      if(this._isMounted){
                        this.setState({...this.state,isLoading: false});
                        notify((err && err?.message) || "error has occurred. please try again later!", "error");
                      }
                    });
                }else{
                  resolve();
                  this.props.history.push(`/profile`);
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
            <WrappedComponent {...this.props} browseUser={this.memoizedBrowseUser} />
          </>
        )
      }
    }
    return withRouter(newComponent);
}

withBrowseUser.propTypes = {
  WrappedComponent: PropTypes.elementType.isRequired
}