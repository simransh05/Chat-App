import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../src/Slices/userSlice";
import recentReducer from "./Slices/recentSlice";
import contactReducer from "./Slices/contactSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    recent: recentReducer,
    contact: contactReducer
  },
});

export default store;
