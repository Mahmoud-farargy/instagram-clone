import React, {useContext} from "react";
import PropTypes from "prop-types";
import { AppContext } from "../../../Context";
import { useHistory } from "react-router-dom";
import { trimText } from "../../../Utilities/TrimText";

const GSCardItem = (props) => {
    const history= useHistory();
    const context = useContext(AppContext);
    const { title, goTo, btnTitle, icon, description, changeOptionIndex } = props
    return (
        <li className="getting--started--box suggestion--item flex-column">
            <div className="suggestion--item-inner flex-column">
                <div className="w-100">
                    <div className="plus--icon--container flex-column">
                        {icon}  
                    </div>
                    <span className="GSTitle" title={title}>{trimText(title, 22)}</span>
                    <p className="GSDescription" title={description}>{ trimText(description,50) }</p> 
                </div>
               
                <button className="profile__btn primary__btn" onClick={() => {history.push(goTo); changeOptionIndex &&  context.changeMainState("activeOption", changeOptionIndex) }} >{btnTitle}</button>
            </div>
      </li>
    )
}
GSCardItem.propTypes = {
    title: PropTypes.string.isRequired,
    goTo: PropTypes.string.isRequired,
    btnTitle: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    changeOptionIndex: PropTypes.object
}
export default GSCardItem;