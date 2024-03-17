import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  roomNumber: {
    type: Number,
  },

  type: {
    type: String,
  },
  unavailableDates: {
    type: [Date],
    default: [],
  },
});

export default mongoose.model("Room", RoomSchema);
