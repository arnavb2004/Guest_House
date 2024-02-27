import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  guestEmail: {
    type: String,
    required: true,
    trim: true,
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
    
    enum: ['Single Occupancy', 'Double Occupancy'], // Assuming only two types for simplicity
  },
  arrivalDate: {
    type: Date,
    
  },
  departureDate: {
    type: Date,
    
  },
  status:{
    type:String,
    enum:['PENDING','APPROVED','REJECTED'],
    default:'PENDING'
  },
  approvals:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:'User'
    }
  ]
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;