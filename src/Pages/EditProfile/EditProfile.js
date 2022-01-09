import React, { PureComponent, Suspense, lazy } from "react";
import Auxiliary from "../../Components/HOC/Auxiliary";
import "./EditProfile.scss";
import { AppContext } from "../../Context";
import { withRouter } from "react-router-dom";
import fbimg from "../../Assets/f0e27bf15519.png";
import MenuOption from "./MenuOption";
import { retry } from "../../Utilities/RetryImport";

// ------------lazy loading-------------
const EditProfileOption = lazy(() => retry(() => import("./MenuOptions/EditProfileOption")));
const ProfessionalAccount = lazy(() => retry(() => import("./MenuOptions/ProfessionalAccount")));
const ChangePassNEmail = lazy(() => retry(() => import("./MenuOptions/ChangePassNEmail")));
const BlockList = lazy(() => retry(() => import("./MenuOptions/BlockList/BlockList")));
const Feedback = lazy(() => retry(() => import("./MenuOptions/Feedback")));
const Themes = lazy(() => retry(() => import("./MenuOptions/Themes")));
// -------x---- lazy loading --------x------
class EditProfile extends PureComponent {
  state = {
    sideMenuOptions: [
      {option:"Edit Profile", id:"Edit_Profile"},
      {option:"Account Settings", id: "Professional_Account"},
      {option:"Change Password or Email", id:"Change_Password_or_Email"},
      {option:"Blocked Users", id:"Blocked_Users" },
      {option:"Feedback", id: "Feedback"},
      {option:"Themes", id:"Themes"}
    ],
  };
  static contextType = AppContext;
  componentDidMount() {
    const { changeMainState} = this.context;
    changeMainState("currentPage", "Edit profile");
  }
  onMenuChange(index, ID) {
    this.context.changeMainState("activeOption", {activeIndex: index, activeID: ID});
  }

  render() {
    const {receivedData, activeOption} = this.context;
    return (
      <Auxiliary>
        <section id="page">
          <div id="editProfile">
            <div className="edit--desktop">
              <div className="edit--box">
                <ul className="flex-column left--side">
                  {this.state.sideMenuOptions &&
                    this.state.sideMenuOptions.length > 0 &&
                    this.state.sideMenuOptions.filter((k) => ((receivedData?.profileInfo?.registrationMethod !== "email" || receivedData?.uid === "L9nP3dEZpyTg7AMIg8JBkrGQIji2") ? (k.id !== "Change_Password_or_Email") : k)).map((item, i) => (
                      <MenuOption
                        onClick={() => this.onMenuChange(i, item.id)}
                        className={
                          activeOption.activeIndex === i
                            ? "active__menu__option"
                            : ""
                        }
                        el={item.option}
                        key={item.id + i}
                        index={i}
                      />
                    ))}
                  <div className="left--bottom--side flex-column">
                    <img loading="lazy" className="unselectable" src={fbimg} alt="fb" />
                    <span className="change__prof__pic mt-3">
                      Accounts Center
                    </span>
                  </div>
                </ul>
                {/* end left side */}
                <Suspense fallback={<div><div className="global__loading"><span className="global__loading__inner"></span></div></div>}>
                    <div className="flex-column right--side">
                    {activeOption.activeID === this.state.sideMenuOptions[0].id ? (
                      <EditProfileOption
                        changeIndex={(i,id) => this.onMenuChange(i, id)}
                      />
                    ) : activeOption.activeID === this.state.sideMenuOptions[1].id ? (
                      <ProfessionalAccount />
                    ) : activeOption.activeID === this.state.sideMenuOptions[2].id ? (
                      <ChangePassNEmail />
                    ) : activeOption.activeID === this.state.sideMenuOptions[3].id ?
                      <BlockList context={this.context} />
                    : activeOption.activeID === this.state.sideMenuOptions[4].id ? (
                      <Feedback />
                    ): activeOption.activeID === this.state.sideMenuOptions[5].id ? (
                      <Themes />
                    ): null} 
                  </div>
                </Suspense>

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
