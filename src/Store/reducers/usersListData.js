import * as actionTypes from "../actions/actions";
const initialState = {
    myData: [],
    uid: "",
    isLoading: false,
    suggestionsList: [],
    initialData: [],
    explore: [],
    homeReels: [],
    homeFeed: [],
}

export const usersListReducer = (state= initialState, actions) => {
    switch(actions.type){
        case actionTypes.UPDATE_USERS_LIST: {
            const { isLoading, suggestionsList, explore, homeReels, homeFeed } = actions.data;
            return {
                ...state,
                isLoading,
                suggestionsList,
                explore,
                homeReels,
                homeFeed
            }
        }
        case actionTypes.UPDATE_MY_DATA: {
            const { newData, UID } = actions.payload;
            if(typeof newData === "object" && Object.keys(newData).length > 0 ){
                return {
                    ...state,
                    myData: newData,
                    ...(UID && (state.myData !== UID)) && {uid: UID}
                }
            }else{
                return state;
            }
        }
        case actionTypes.UDPATE_INITIAL_DATA: {
            return {
                ...state,
                initialData: actions.payload
            }
        }
        case actionTypes.UPDATE_LOADING_STATE: {
            const isLoading = actions.newState;
            return {
                ...state,
                isLoading: typeof isLoading === "boolean" ? isLoading : !state.isLoading
            }
        }
        default: return state;
    }
}