import { createSlice } from "@reduxjs/toolkit";

const initData = { posts: null, getPosts: null };

const contentSlice = createSlice({
  name: "contentSlice",
  initialState: initData,
  reducers: {
    postUpdate(state, action) {
      state.posts = action.payload;
    },
    getPostsUpdate(state, action) {
      state.getPosts = action.payload;
    },
  },
});

export const contentSliceActions = contentSlice.actions;
export default contentSlice.reducer;
