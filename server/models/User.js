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
    enum: ['USER', 'ADMIN',"HOD COMPUTER SCIENCE",
    "HOD ELECTRICAL ENGINEERING",
    "HOD MECHANICAL ENGINEERING",
    "HOD CHEMISTRY",
    "HOD MATHEMATICS",
    "HOD PHYSICS",
    "HOD HUMANITIES AND SOCIAL SCIENCES",
    "HOD BIOMEDICAL ENGINEERING",
    "HOD CHEMICAL ENGINEERING",
    "HOD METALLURGICAL AND MATERIALS ENGINEERING",
    "HOD CIVIL ENGINEERING",'CHAIRMAN','DIRECTOR',
    "DEAN RESEARCH AND DEVELOPMENT",
    "DEAN STUDENT AFFAIRS",
    "DEAN FACULTY AFFAIRS AND ADMINISTRATION",
    "DEAN UNDER GRADUATE STUDIES",
    "DEAN POST GRADUATE STUDIES",
    'REGISTRAR','ASSOCIATE DEAN HOSTEL MANAGEMENT','ASSOCIATE DEAN CONTINUING EDUCATION AND OUTREACH ACTIVITIES','ASSOCIATE DEAN INTERNATIONAL RELATIONS AND ALUMNI AFFAIRS','ASSOCIATE DEAN INFRASTRUCTURE','CASHIER'],
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
        enum:['ADMIN',"HOD COMPUTER SCIENCE",
        "HOD ELECTRICAL ENGINEERING",
        "HOD MECHANICAL ENGINEERING",
        "HOD CHEMISTRY",
        "HOD MATHEMATICS",
        "HOD PHYSICS",
        "HOD HUMANITIES AND SOCIAL SCIENCES",
        "HOD BIOMEDICAL ENGINEERING",
        "HOD CHEMICAL ENGINEERING",
        "HOD METALLURGICAL AND MATERIALS ENGINEERING",
        "HOD CIVIL ENGINEERING",'CHAIRMAN','DIRECTOR',
        "DEAN RESEARCH AND DEVELOPMENT",
        "DEAN STUDENT AFFAIRS",
        "DEAN FACULTY AFFAIRS AND ADMINISTRATION",
        "DEAN UNDER GRADUATE STUDIES",
        "DEAN POST GRADUATE STUDIES",'REGISTRAR','ASSOCIATE DEAN HOSTEL MANAGEMENT','ASSOCIATE DEAN CONTINUING EDUCATION AND OUTREACH ACTIVITIES','ASSOCIATE DEAN INTERNATIONAL RELATIONS AND ALUMNI AFFAIRS','ASSOCIATE DEAN INFRASTRUCTURE'],
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
