import { createStore, applyMiddleware } from "redux";
import { rootReducer } from "./rootReducer";
import thunk from "redux-thunk";
import { composeWithDevTools } from 'redux-devtools-extension';

const middleWares = [thunk];
const initialState = {}
const devTools = process.env.NODE_ENV === "production" ?
            applyMiddleware(...middleWares)
            : composeWithDevTools(applyMiddleware(...middleWares));
const store = createStore( rootReducer, initialState, devTools);

export { store };