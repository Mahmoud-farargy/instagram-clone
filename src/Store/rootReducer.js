import { combineReducers } from "redux";
import { modalsReducer } from "./reducers/modals";
import { usersListReducer } from "./reducers/usersListData";

export const rootReducer = combineReducers({
    modals: modalsReducer,
    userList: usersListReducer
});