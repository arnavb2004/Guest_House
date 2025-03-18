import Room from "./../models/Room.js";

export const getAllRooms = async (req, res) => {
    try {
        const currentDate = new Date(); 
    
        const rooms = await Room.find(); 
    
        const updatedRooms = rooms.map(room => {
          const futureBookings = room.bookings.filter(booking => 
            new Date(booking.endDate) >= currentDate 
          );
    
          return { ...room._doc, bookings: futureBookings }; 
        });
    
        res.json(updatedRooms); 
      } catch (error) {
        res.status(500).json({ message: "Error fetching rooms", error });
      }
};

