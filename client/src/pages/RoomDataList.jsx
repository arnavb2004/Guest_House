import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { privateRequest } from "../utils/useFetch";

const RoomDataList = () => {
  const user = useSelector((state) => state.user);
  const http = privateRequest(user.accessToken, user.refreshToken);
  const [rooms, setRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(startDate.getDate() + 9)));
  const [occupancyFilter, setOccupancyFilter] = useState("all");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await http.get("/reservation/room-details");
        setRooms(response.data);
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };
    fetchRooms();
  }, []);

  const generateDates = () => {
    const dates = [];
    let current = new Date(startDate);
    console.log(endDate);
    while (current <= endDate) {
      dates.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const dates = generateDates();

  // Filter rooms based on occupancy type
  // Filter rooms based on occupancy type and room number search query
const filteredRooms = rooms.filter((room) => {
  // Check if room type matches the occupancy filter
  if (occupancyFilter !== "all") {
    const roomTypeLower = room.roomType?.toLowerCase();
    if (occupancyFilter === "single" && !roomTypeLower.includes("single")) return false;
    if (occupancyFilter === "double" && !roomTypeLower.includes("double")) return false;
  }

  // Check if room number matches the search query
  if (searchQuery && !room.roomNumber.toString().toLowerCase().includes(searchQuery.toLowerCase())) {
    return false;
  }

  return true;
});

  

  // Generate unique colors for reservations
  const reservationColors = {};
  const generateRandomColor = () => `hsl(${Math.random() * 360}, 70%, 70%)`;

  const getBookingCellData = (room, date, previousBookings) => {
    const booking = room.bookings.find(
      (booking) =>
        new Date(booking.startDate) <= new Date(date) &&
        new Date(booking.endDate) >= new Date(date)
    );

    if (booking) {
      if (!reservationColors[booking.purpose]) {
        reservationColors[booking.purpose] = generateRandomColor();
      }

      if (new Date(booking.startDate).toISOString().split("T")[0] === date) {
        return {
          span: Math.floor((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24)) + 1,
          purpose: booking.purpose,
          color: reservationColors[booking.purpose],
        };
      }

      if (new Date(date) > new Date(booking.startDate) && new Date(date) <= new Date(booking.endDate)) {
        previousBookings.add(room._id);
        return "skip";
      }
    }
    return null;
  };

  return (
    <div className="w-full px-9 overflow-y-auto">
      <h1 className="text-3xl font-bold text-center my-6">Room Booking Details</h1>

      {/* Filters Section */}
      <div className="flex flex-wrap gap-4 justify-between mb-6">
        <input
          type="text"
          placeholder="Search by Room Number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded-lg p-2 w-1/4"
        />

<button
    onClick={() => {
      const today = new Date();
      setStartDate(today);
      setEndDate(new Date(today.getTime()));  // Set end date to 9 days from today
    }}
    className="bg-green-600 text-white px-4 py-2 rounded-lg"
  >
    Current Date
  </button>
        {/* Occupancy Filter */}
        <select
          value={occupancyFilter}
          onChange={(e) => setOccupancyFilter(e.target.value)}
          className="border rounded-lg p-2 w-1/4"
        >
          <option value="all">All Rooms</option>
          <option value="single">Single Occupancy</option>
          <option value="double">Double Occupancy</option>
        </select>

        {/* Date Range Selection */}
        <input
          type="date"
          value={startDate.toISOString().split("T")[0]}
          onChange={(e) => setStartDate(new Date(e.target.value))}
          className="border rounded-lg p-2"
        />
        <input
          type="date"
          value={endDate.toISOString().split("T")[0]}
          onChange={(e) => setEndDate(new Date(e.target.value))}
          className="border rounded-lg p-2"
        />
      </div>

      {/* Table for Bookings */}
      <div className="overflow-auto">
        <table className="table-auto border-collapse w-full">
          <thead>
            <tr>
              <th className="border p-2">Date</th>
              {filteredRooms.map((room) => (
                <th key={room._id} className="border p-2">Room {room.roomNumber}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dates.map((date) => {
              const previousBookings = new Set();
              return (
                <tr key={date}>
                  <td className="border p-2">{date}</td>
                  {filteredRooms.map((room) => {
                    const bookingData = getBookingCellData(room, date, previousBookings);

                    if (bookingData === "skip") {
                      return null;
                    }

                    if (bookingData) {
                      return (
                        <td
                          key={room._id + date}
                          className="border p-2 text-center"
                          rowSpan={bookingData.span}
                          style={{ backgroundColor: bookingData.color }}
                        >
                          {bookingData.purpose}
                        </td>
                      );
                    } else {
                      return <td key={room._id + date} className="border p-2"></td>;
                    }
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

<div className="flex justify-center gap-4 my-6">
  <button
    onClick={() => {
      const newStart = new Date(startDate);
      newStart.setDate(startDate.getDate() - 10);  // Go back 10 days
      setStartDate(newStart);
      setEndDate(new Date(newStart.getTime() + 9 * 24 * 60 * 60 * 1000));  // Set the end date 9 days after the new start date
    }}
    className="bg-gray-600 text-white px-4 py-2 rounded-lg"
  >
    Previous 10 Days
  </button>

  <button
    onClick={() => {
      const today = new Date();
      setStartDate(today);
      setEndDate(new Date(today.getTime() + 9 * 24 * 60 * 60 * 1000));  // Set end date to 9 days from today
    }}
    className="bg-green-600 text-white px-4 py-2 rounded-lg"
  >
    Reset to Today
  </button>

  <button
    onClick={() => {
      const newStart = new Date(startDate);
      newStart.setDate(startDate.getDate() + 10);  // Move ahead 10 days
      setStartDate(newStart);
      setEndDate(new Date(newStart.getTime() + 9 * 24 * 60 * 60 * 1000));  // Set the end date 9 days after the new start date
    }}
    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
  >
    Next 10 Days
  </button>
</div>

    </div>
  );
};

export default RoomDataList;
