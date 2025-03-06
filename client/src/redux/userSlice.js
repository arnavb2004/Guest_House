import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const userSlice = createSlice({
  name: "user",
  initialState: {
    id: "",
    name: "",
    email: "",
    contact: "",
    role: "",
    accessToken: "",
    refreshToken: "",
    notifications: [],
    ecode: "",
    department: "",
    designation: "",
  },
  reducers: {
    setUserSlice: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.id = user._id;
      state.name = user.name;
      state.role = user.role;
      state.notifications = user.notifications;
      state.contact = user.contact;
      state.email = user.email;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.ecode = user.ecode;
      state.department = user.department;
      state.designation = user.designation;
    },
    logout: (state) => {
      state.id = "";
      state.name = "";
      state.contact = "";
      state.email = "";
      state.role = "";
      state.accessToken = "";
      state.refreshToken = "";
      state.notifications = [];
      state.ecode = "";
      state.department = "";
      state.designation = "";
    },
    updateUserDetails: (state, action) => {
      const { name, contact, notifications } = action.payload;
      if (name !== undefined) {
        state.name = name;
      }
      if (contact !== undefined) {
        state.contact = contact;
      }
      if (notifications !== undefined) {
        state.notifications = notifications;
      }
    },
  },
});

export const { setUserSlice, logout, updateUserDetails } = userSlice.actions;
export default userSlice.reducer;
