import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const userSlice = createSlice({
  name: "user",
  initialState: {
    name: "",
    email: "",
    contact: "",
    role: "",
  },
  reducers: {
    setUserSlice: (state, action) => {
      const { name, contact, role, email } = action.payload;
      state.name = name;
      state.role = role;
      state.contact = contact;
      state.email = email;
    },
    logout: (state) => {
      state.name = "";
      state.contact = "";
      state.email = "";
      state.role = "";
    },
  },
});

export const { setUserSlice, logout } = userSlice.actions;
export default userSlice.reducer;
