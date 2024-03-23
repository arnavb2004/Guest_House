import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the initial state for notifications
const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

// Define an async thunk to fetch notifications from the backend
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async () => {
    try {
      const response = await axios.get('/api/notifications');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Create a slice for notifications
const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle pending state while fetching notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      // Handle successful fetch of notifications
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.notifications = action.payload;
      })
      // Handle error while fetching notifications
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export actions and reducer from the slice
export const {} = notificationSlice.actions;
export default notificationSlice.reducer;
