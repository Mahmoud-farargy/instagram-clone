import * as actionTypes from "../actions/actions";

const initialState = {
    modalsState: {
        comments: false,
        users: false,
        options: false,
        post: false,
        reelComments: false,
        newMsg: false
    },
    usersModalList: []
};
export const modalsReducer = (state = initialState, actions) => {
    switch(actions.type){
        case actionTypes.CHANGE_MODAL_STATE:
            const { modalType, hasDataList, usersList, usersType } = actions.payload;
                let copiedObj = JSON.parse(JSON.stringify(state.modalsState));
                if (hasDataList) {
                  copiedObj[modalType] = true;
                } else {
                  Object.keys(copiedObj).forEach((key) => copiedObj[key] = false);
                }
                return {
                    ...state,
                    modalsState: copiedObj,
                    usersModalList:
                      modalType === "users" && hasDataList
                        ? { type: usersType, list: usersList }
                        : {},
                }
        default: return state;
    }
}