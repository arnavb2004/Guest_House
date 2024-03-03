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
  },
  reducers: {
    setUserSlice: (state, action) => {
      const { name, contact, role, email } =
        action.payload.user;
      const { accessToken, refreshToken } = action.payload;
      state.name = name;
      state.role = role;
      state.contact = contact;
      state.email = email;
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
    },
  },
});

export const { setUserSlice, logout } = userSlice.actions;
export default userSlice.reducer;
