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
      "Edit Profile",
      "Professional Account",
      "Change Password or Email",
      "Blocked Accounts"
    ],
    activeIndex: 0,
  };
  static contextType = AppContext;
  componentDidMount() {
    const { changeMainState } = this.context;
    changeMainState("currentPage", "Edit profile");
  }

  onMenuChange(index) {
    this.setState(updateObject(this.state, { activeIndex: index }));
    // this.autoScroll && this.autoScroll?.current.scrollIntoView&& this.autoScroll.current.scrollIntoView({behavior: "smooth", block: "start"});
  }
  render() {
    return (
      <Auxiliary>
        <section id="page">
          <div id="editProfile">
            <div className="edit--desktop">
              <div className="edit--box">
                <ul className="flex-column left--side">
                  {this.state.sideMenuOptions &&
                    this.state.sideMenuOptions.length > 0 &&
                    this.state.sideMenuOptions.map((item, i) => (
                      <MenuOption
                        onClick={() => this.onMenuChange(i)}
                        className={
                          this.state.activeIndex === i
                            ? "active__menu__option"
                            : ""
                        }
                        el={item}
                        key={i}
                        index={i}
                      />
                    ))}
                  <div className="left--bottom--side flex-column">
                    <img src={fbimg} alt="fb" />
                    <span className="change__prof__pic mt-3">
                      Accounts Center
                    </span>
                  </div>
                </ul>
                {/* end left side */}
                <div className="flex-column right--side" ref={this.autoScroll}>
                  {this.state.activeIndex === 0 ? (
                    <EditProfileOption
                      changeIndex={(e) => this.onMenuChange(e)}
                    />
                  ) : this.state.activeIndex === 1 ? (
                    <ProfessionalAccount />
                  ) : this.state.activeIndex === 2 ? (
                    <ChangePassNEmail />
                  ) : this.state.activeIndex === 3 ?
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
