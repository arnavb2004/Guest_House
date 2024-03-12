import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    guestEmail: {
      type: String,
      required: true,
      trim: true,
    },
    guestName: {
      type: String,
      required: true,
    },
    numberOfGuests: {
      type: Number,
      required: true,
    },
    numberOfRooms: {
      type: Number,
      required: true,
    },
    roomType: {
      type: String,

      enum: ["Single Occupancy", "Double Occupancy"], // Assuming only two types for simplicity
    },
    arrivalDate: {
      type: Date,
    },
    departureDate: {
      type: Date,
    },
    purpose: {
      type: String,
    },
    category: {
      type: String,
      enum: ["A", "B", "C"], // Assuming only three types for simplicity
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    approvals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    address: {
      type: String,
      required: true,
    },
    files:[{
      type:String,
    }]
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const Reservation = mongoose.model("Reservation", reservationSchema);

export default Reservation;
