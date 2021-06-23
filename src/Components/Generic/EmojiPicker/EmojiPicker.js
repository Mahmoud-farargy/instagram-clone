import React, {useState} from "react";
import Picker, { SKIN_TONE_LIGHT } from "emoji-picker-react";
import { BiSmile } from "react-icons/bi";
const EmojiPicker = ({onEmojiClick}) => {
    const [isShown, setBeingShowing] = useState(false);
    return(
        <>
        <BiSmile onClick={() => setBeingShowing(true)} className="smiley__icon"/>
        {
            isShown &&
            <div className="fadeEffect" style={{position:"absolute"}}>
               <Picker
                  onEmojiClick={onEmojiClick}
                  disableAutoFocus={ true }
                  preload={ false }
                  skinTone={ SKIN_TONE_LIGHT }
                  groupNames={{ smileys_people: "PEOPLE" }}
                  native
                  pickerStyle={{ width: '350px', height: "360px" }}
                  groupVisibility={{
                    flags: false,
                    symbols: false,
                    objects: false
                  }}
                />
                <div
                className="hidden--backdrop"
                onClick={() => {
                setBeingShowing(false)
                }}
              ></div>
            </div>
                
          } 
        </>
    )
}

export default EmojiPicker;