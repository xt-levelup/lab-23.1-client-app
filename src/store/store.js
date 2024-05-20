import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./authSlice";
import contentSlice from "./contentSlice";

const store = configureStore({
  reducer: {
    authSlice: authSlice,
    contentSlice: contentSlice,
  },
});

export default store;
