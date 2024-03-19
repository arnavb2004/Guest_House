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
      enum: ["A", "B", "C", "D"], // Assuming only three types for simplicity
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "HOLD"],
      default: "PENDING",
    },
    stepsCompleted: {
      type: Number,
      required: true,
      default: 0,
    },
    approvals: [
      {
        type: String,
        enum: [
          "ADMIN",
          "HOD",
          "CHAIRMAN",
          "DIRECTOR",
          "DEAN",
          "REGISTRAR",
          "ASSOCIATE DEAN",
        ],
        default: [],
      },
    ],
    reviewers: [
      {
        type: String,
        enum: [
          "ADMIN",
          "HOD",
          "CHAIRMAN",
          "DIRECTOR",
          "DEAN",
          "REGISTRAR",
          "ASSOCIATE DEAN",
        ],
        default: ["ADMIN"],
      },
    ],
    address: {
      type: String,
      required: true,
    },
    comments: {
      type: String,
    },
    receipt: {
      type: String,
      required: true,
    },
    files: [
      {
        refid: {
          type: String,
          required: true,
        },
        extension: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const Reservation = mongoose.model("Reservation", reservationSchema);

export default Reservation;
