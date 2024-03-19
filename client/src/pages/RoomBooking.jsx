import React, { useState } from 'react';
import './RoomBooking.css';
import { toast } from "react-toastify";

const RoomBooking = () => {
  const roomsData = [
    { id: 1, roomNumber:101, bookings: [{ startDate: '2024-04-01', endDate: '2024-04-06', userId: 'user1' },{startDate: '2024-04-09', endDate: '2024-04-15', userId: 'user2'}] },
    { id: 2, roomNumber:102, bookings: [{ startDate: '2024-04-10', endDate: '2024-05-15', userId: 'user2' }] },
    { id: 3, roomNumber:103, bookings: [] },
    { id: 4, roomNumber:104, bookings: [] },
    { id: 5, roomNumber:105, bookings: [{ startDate: '2024-06-20', endDate: '2024-06-25', userId: 'user3' }] },
    { id: 6, roomNumber:106, bookings: [] },
    { id: 7, roomNumber:107, bookings: [] },
    { id: 8, roomNumber:108, bookings: [] },
    { id: 9, roomNumber:109, bookings: [{ startDate: '2024-07-12', endDate: '2024-07-18', userId: 'user4' }] },
    { id: 10, roomNumber:110, bookings: [] },
    { id: 11, roomNumber:111, bookings: [] },
    { id: 12, roomNumber:112, bookings: [] },
    { id: 13, roomNumber:113, bookings: [] },
    { id: 14, roomNumber:114, bookings: [{ startDate: '2024-08-05', endDate: '2024-08-10', userId: 'user5' }] },
    { id: 15, roomNumber:115, bookings: [] },
    { id: 16, roomNumber:116, bookings: [{ startDate: '2024-09-15', endDate: '2024-09-20', userId: 'user6' }] },
    { id: 17, roomNumber:117, bookings: [{ startDate: '2024-08-15', endDate: '2024-08-25', userId: 'user7' }] },
    { id: 18, roomNumber:118, bookings: [{ startDate: '2024-08-25', endDate: '2024-08-29', userId: 'user8' }] },
    { id: 19, roomNumber:119, bookings: [{ startDate: '2024-08-05', endDate: '2024-09-02', userId: 'user9' }] },
    { id: 20, roomNumber:120, bookings: [] }
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
