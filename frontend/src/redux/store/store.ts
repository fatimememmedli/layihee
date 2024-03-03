import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./../slices/userSlice";
import adminReducer from "./../slices/adminSlice";
export const store = configureStore({
  reducer: {
    users: userReducer,
    admin: adminReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
