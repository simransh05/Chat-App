import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../src/Slices/userSlice";
import recentReducer from "./Slices/recentSlice";
import contactReducer from "./Slices/contactSlice";
import currentUserReducer from './Slices/currentUserSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    recent: recentReducer,
    contact: contactReducer,
    currentUser: currentUserReducer,
  },
});

export default store;
