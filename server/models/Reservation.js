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
    reviewers: [
      {
        role: {
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
          default: "ADMIN",
        },
        comments:{
          type: String,
        },
        status: {
          type: String,
          enum: ["PENDING", "APPROVED", "REJECTED", "HOLD"],
          default: "PENDING",
        },
      },
    ],
    address: {
      type: String,
      required: true,
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
    bookings: [
      {
        startDate: {
          type: Date,
          required: true,
        },
        endDate: {
          type: Date,
          required: true,
        },
        roomNumber:{
          type: Number,
          required: true,
        }
      },
    ],
    payment:{
      status:{
        type:String,
        enum:["PENDING","PAID"],
        default:"PENDING"
      },
      amount:{
        type:Number,
        // required:true,
      },
      payment_method:{
        type:String,
        // enum:["CASH","CARD","CHEQUE","UPI","DEPT"],
        // required:true,
      },
      transaction_id:{
        type:String,
        // required:true,
      }
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const Reservation = mongoose.model("Reservation", reservationSchema);

export default Reservation;
