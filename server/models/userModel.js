import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
  },
  refreshToken: {
    type: String,
    default: "",
  },
});

export default mongoose.model("User", userSchema);
