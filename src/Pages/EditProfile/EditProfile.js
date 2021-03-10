import React , {PureComponent} from "react";
import Auxiliary from "../../Components/HOC/Auxiliary";
import Classes from "./EditProfile.module.css";
import {Avatar} from "@material-ui/core";
import {AppContext} from "../../Context";

class EditProfile extends PureComponent {
    static contextType = AppContext;
    submitForm () {
        console.log("Form submitted");
    }
    render(){
        const {userName} = this.context.receivedData;

        return(
            <Auxiliary>
                <section id="page">
                    <div id="editProfile">
                        <div className={Classes.EditDesktop}>
                            <div className={Classes.EditBox}>
                                <ul>
                                    <li>kk</li>
                                </ul>
                                <div className={`flex-column ${Classes.RightSide}`}>
                                    <div className={`flex-row ${Classes.ChangePhoto}`}>
                                        <Avatar className="user__picture" src="f"/>
                                        <div className="user--pic--container flex-column">
                                            <p>{userName}</p>
                                            <span>Change Profile Photo</span>
                                        </div>
                                    </div>
                                        <form className="flex-column" onSubmit={()=> this.submitForm()}>
                                            <div className="form-group d-inline-block">
                                                <label htmlFor="name">Name</label>
                                                <input id="name" placeholder="Name"/>
                                            </div>
                                            <input role="button" type="submit" value="Submit" className=" profile__btn prof__btn__followed" />
                                        </form>
                                    
                                </div>
                            </div>
                        </div>
                        <div className={Classes.EditMobile}>

                        </div>
                    </div>
                </section> 
            </Auxiliary>
        )
    }
}
export default EditProfile;