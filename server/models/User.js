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
  role: {
    type: String,
    enum: ['USER', 'ADMIN','HOD','CHAIRMAN','DIRECTOR','DEAN','REGISTRAR','ASSOCIATE DEAN'],
    default: 'USER',
  }
});

export default mongoose.model("User", userSchema);
