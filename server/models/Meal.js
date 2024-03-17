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

});

const Meal = mongoose.model("Meal", mealSchema);

export default Meal;
