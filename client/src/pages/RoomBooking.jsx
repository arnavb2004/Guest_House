import React, { useState } from 'react';
import './RoomBooking.css';
import { ToastContainer, toast } from "react-toastify";

const RoomBooking = () => {
  const roomsData = [
    { id: 1, name: 'Room 1', bookings: [{ startDate: '2024-04-01', endDate: '2024-04-06', userId: 'user1' },{startDate: '2024-04-09', endDate: '2024-04-15', userId: 'user2'}] },
    { id: 2, name: 'Room 2', bookings: [{ startDate: '2024-04-10', endDate: '2024-05-15', userId: 'user2' }] },
    { id: 3, name: 'Room 3', bookings: [] },
    { id: 4, name: 'Room 4', bookings: [] },
    { id: 5, name: 'Room 5', bookings: [{ startDate: '2024-06-20', endDate: '2024-06-25', userId: 'user3' }] },
    { id: 6, name: 'Room 6', bookings: [] },
    { id: 7, name: 'Room 7', bookings: [] },
    { id: 8, name: 'Room 8', bookings: [] },
    { id: 9, name: 'Room 9', bookings: [{ startDate: '2024-07-12', endDate: '2024-07-18', userId: 'user4' }] },
    { id: 10, name: 'Room 10', bookings: [] },
    { id: 11, name: 'Room 11', bookings: [] },
    { id: 12, name: 'Room 12', bookings: [] },
    { id: 13, name: 'Room 13', bookings: [] },
    { id: 14, name: 'Room 14', bookings: [{ startDate: '2024-08-05', endDate: '2024-08-10', userId: 'user5' }] },
    { id: 15, name: 'Room 15', bookings: [] },
    { id: 16, name: 'Room 16', bookings: [{ startDate: '2024-09-15', endDate: '2024-09-20', userId: 'user6' }] },
    { id: 17, name: 'Room 17', bookings: [{ startDate: '2024-08-15', endDate: '2024-08-25', userId: 'user7' }] },
    { id: 18, name: 'Room 18', bookings: [{ startDate: '2024-08-25', endDate: '2024-08-29', userId: 'user8' }] },
    { id: 19, name: 'Room 19', bookings: [{ startDate: '2024-08-05', endDate: '2024-09-02', userId: 'user9' }] },
    { id: 20, name: 'Room 20', bookings: [] }
  ];

  const [rooms, setRooms] = useState(roomsData);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleFilter = () => {
    try {
      if (endDate < startDate || endDate === "" || startDate === "") {
        toast.error("Enter Valid endDate and startDate");
        return;
      }
  
      // Store the original rooms data
      const originalRoomsData = [...roomsData];
  
      // Filter the rooms based on the date range
      const updatedRooms = originalRoomsData.map(room => {
        const filteredBookings = room.bookings.filter(booking => {
          return booking.startDate <= endDate && booking.endDate >= startDate;
        });
        return { ...room, bookings: filteredBookings };
      });
  
      // Set the rooms state to the filtered rooms
      setRooms(updatedRooms);
      toast.success("Filtered!!");
    } catch (error) {
      console.error("Filter failed:", error);
      toast.error("Filter failed: Please try again later.");
    }
  };

  return (
    <div className="room-booking">
      <ToastContainer/>
      <h2 className="room-heading">Room Booking</h2>
      <div className="filter-container">
        <label className="filter-label">Start Date:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="filter-input" />
        <label className="filter-label">End Date:</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="filter-input" />
        <button onClick={handleFilter} className="filter-button">Filter</button>
      </div>
      <div className="room-grid">
        {rooms.map(room => (
          <div key={room.id} className={`room ${room.bookings.length > 0 ? 'booked-during-range' : 'available'}`}>
            <div className="room-info">
              <h3>{room.name}</h3>
              {room.bookings.map((booking, index) => (
                <div key={index} className="booking-info">
                  <p>Booked from: {booking.startDate} to {booking.endDate}</p>
                  <p>User ID: {booking.userId}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomBooking;
