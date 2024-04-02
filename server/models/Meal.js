import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  items: [
    {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
    },
  ],
  amount: {
    type: Number,
    required: true,
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
      comments: {
        type: String,
      },
      status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED", "HOLD"],
        default: "PENDING",
      },
    },
  ],
  comments: {
    type: String,
  },
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED", "HOLD"],
    default: "PENDING",
  },
});

const Meal = mongoose.model("Meal", mealSchema);

export default Meal;
