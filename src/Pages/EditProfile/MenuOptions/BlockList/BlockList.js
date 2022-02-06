import React from "react";
import Auxiliary from "../../../../Components/HOC/Auxiliary";
import BlockedItem from "./BlockedItem";
const BlockList = (props) => {
    const {receivedData, handleUserBlocking, notify} = props.context;
    return (
        <Auxiliary>
            <section  className="option--container fadeEffect">
                <div className="block--list--inner flex-column">
                    {
                        receivedData && receivedData?.blockList.length > 0 ?
                        <ul className="block__list__ul">
                            {
                            receivedData?.blockList.map((item, index) =>
                                    <BlockedItem key={item.blockedUid || index} userblockingFunc={handleUserBlocking} notify={notify} item={item}/>
                                )
                            }
                        </ul>
                        :
                        <div className="empty--block--list">
                            <h1>You haven't blocked any users.</h1>
                        </div>
                    }
                </div>
                
            </section>
        </Auxiliary>
    )
}

export default BlockList;