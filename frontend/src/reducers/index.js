import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import { reducer as formReducer } from "redux-form";
import watchReducer from './watch.js';

// main reducers
export const reducers = combineReducers({
  routing: routerReducer,
  form: formReducer,
  watch: watchReducer
});
