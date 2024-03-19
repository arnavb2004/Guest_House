import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  roomNumber: {
    type: Number,
  },

  type: {
    type: String,
  },
  bookings: [
    {
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

    }
  ]
});

export default mongoose.model("Room", RoomSchema);
