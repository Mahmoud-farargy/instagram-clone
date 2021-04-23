import React, { PureComponent } from "react";
import Auxiliary from "../../Components/HOC/Auxiliary";
import "./EditProfile.scss";
import { AppContext } from "../../Context";
import { updateObject } from "../../Utilities/Utility";
import { withRouter } from "react-router-dom";
import fbimg from "../../Assets/f0e27bf15519.png";
import MenuOption from "./MenuOption";
import EditProfileOption from "./MenuOptions/EditProfileOption";
import ProfessionalAccount from "./MenuOptions/ProfessionalAccount";
import ChangePassNEmail from "./MenuOptions/ChangePassNEmail";
import BlockList from "./MenuOptions/BlockList/BlockList";

class EditProfile extends PureComponent {
  state = {
    sideMenuOptions: [
      {option:"Edit Profile", id:"Edit_Profile"},
      {option:"Account Settings", id: "Professional_Account"},
      {option:"Change Password or Email", id:"Change_Password_or_Email"},
      {option:"Blocked Users", id:"Blocked_Users" }
    ],
    active: {activeIndex: 0, activeID: "Edit_Profile"},
  };
  static contextType = AppContext;
  componentDidMount() {
    const { changeMainState} = this.context;
    changeMainState("currentPage", "Edit profile");
  }
  onMenuChange(index, ID) {
    this.setState(updateObject(this.state, {active: {activeIndex: index, activeID: ID}}));
    // this.autoScroll && this.autoScroll?.current.scrollIntoView&& this.autoScroll.current.scrollIntoView({behavior: "smooth", block: "start"});
  }

  render() {
    const {receivedData} = this.context;
    return (
      <Auxiliary>
        <section id="page">
          <div id="editProfile">
            <div className="edit--desktop">
              <div className="edit--box">
                <ul className="flex-column left--side">
                  {this.state.sideMenuOptions &&
                    this.state.sideMenuOptions.length > 0 &&
                    this.state.sideMenuOptions.filter((k) => (receivedData?.profileInfo?.registerationMethod !== "email" ? k.id !== "Change_Password_or_Email" : k)).map((item, i) => (
                      <MenuOption
                        onClick={() => this.onMenuChange(i, item.id)}
                        className={
                          this.state.active.activeIndex === i
                            ? "active__menu__option"
                            : ""
                        }
                        el={item.option}
                        key={item.id + i}
                        index={i}
                      />
                    ))}
                  <div className="left--bottom--side flex-column">
                    <img src={fbimg} alt="fb" loading="lazy" />
                    <span className="change__prof__pic mt-3">
                      Accounts Center
                    </span>
                  </div>
                </ul>
                {/* end left side */}
                <div className="flex-column right--side" ref={this.autoScroll}>
                  {this.state.active.activeID === this.state.sideMenuOptions[0].id ? (
                    <EditProfileOption
                      changeIndex={(i,id) => this.onMenuChange(i, id)}
                    />
                  ) : this.state.active.activeID === this.state.sideMenuOptions[1].id ? (
                    <ProfessionalAccount />
                  ) : this.state.active.activeID === this.state.sideMenuOptions[2].id ? (
                    <ChangePassNEmail />
                  ) : this.state.active.activeID === this.state.sideMenuOptions[3].id ?
                    <BlockList context={this.context} />
                   : null}
                </div>
                {/* end right side */}
              </div>
            </div>
          </div>
        </section>
      </Auxiliary>
    );
  }
}
export default withRouter(EditProfile);
