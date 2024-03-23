import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  roomNumber: {
    type: Number,
    required: true,
  },

  type: {
    type: String,
    enum: ["Single Occupancy", "Double Occupancy"],
    required: true,
  },
  bookings: [
    {
      startDate: {
        type: Date,
        required:true
      },
      endDate: {
        type: Date,
        required:true
      },
      user: {
        type: String,
        required:true
      },

    }
  ]
});

export default mongoose.model("Room", RoomSchema);
