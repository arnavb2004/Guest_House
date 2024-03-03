import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const userSlice = createSlice({
  name: "user",
  initialState: {
    name: "",
    email: "",
    contact: "",
    role: "",
    accessToken: "",
    refreshToken: "",
    accessToken: "",
    refreshToken: "",
  },
  reducers: {
    setUserSlice: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.name = user.name;
      state.role = user.role;
      state.contact = user.contact;
      state.email = user.email;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
    },
    logout: (state) => {
      state.name = "";
      state.contact = "";
      state.email = "";
      state.role = "";
      state.accessToken = "";
      state.refreshToken = "";
      state.accessToken = "";
      state.refreshToken = "";
    },
  },
});

export const { setUserSlice, logout } = userSlice.actions;
export default userSlice.reducer;
