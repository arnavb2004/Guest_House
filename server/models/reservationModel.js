import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  guestName: {
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
    
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;