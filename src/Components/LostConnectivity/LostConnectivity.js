import React, { useEffect } from "react";
import Auxiliary from "../HOC/Auxiliary";
import Modal from "react-modal";

const LostConnectivity = () => {
    const customStyles = {
        content : {
          position : "fixed",
          top                   : '50%',
          left                  : '50%',
          right                 : 'auto',
          bottom                : 'auto',
          marginRight           : '-50%',
          transform             : 'translate(-50%, -50%)',
          overflow              : "hidden",
        }
      };
    useEffect (() => {
        document.body.style.overflow = "hidden";
        return () => {
         document.body.style.overflow = "visible";
        };
    }, []);
    return (
        <Auxiliary>
            <div id="lostConnectivity">
            <Modal
                ariaHideApp={false}
                isOpen={true}
                style={customStyles}
                contentLabel="Network lost"
                >
                <div>You appear to have lost connection!</div>
            </Modal>
            </div>
        </Auxiliary>
    )
}
export default LostConnectivity;