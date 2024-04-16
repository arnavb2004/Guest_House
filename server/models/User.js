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
    enum: ['USER', 'ADMIN','HOD','CHAIRMAN','DIRECTOR','DEAN','REGISTRAR','ASSOCIATE DEAN', 'CASHIER'],
    default: 'USER',
  },
  pendingRequest: {
    type: Number,
    default: 0
  },
  notifications: [
    {
      message: {
        type: String,
        required: true,
      },
      sender:{
        type:String,
        enum:['ADMIN','HOD','CHAIRMAN','DIRECTOR','DEAN','REGISTRAR','ASSOCIATE DEAN'],
      },
      res_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Reservation'
      },
      // read: //includes a bool and date of read
      //   {
      //     status:{
      //       type:Boolean,
      //       default:false
      //     },
      //     read_at:{
      //       type:Date,
      //     }
      //   },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

export default mongoose.model("User", userSchema);
