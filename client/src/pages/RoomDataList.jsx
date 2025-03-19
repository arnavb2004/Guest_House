import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Menu from "../components/Menu";
import Sidebar from "../components/Sidebar";
import { useSelector } from "react-redux";
import { privateRequest } from "../utils/useFetch";


// import backgroundImage from "../images/backgroundImage.jpeg";

const RoomDataList = () => {
    const user = useSelector((state) => state.user);
const http = privateRequest(user.accessToken, user.refreshToken);
  const [rooms, setRooms] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("noFilter");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await http.get("/reservation/room-details");
        // if (!response.ok) throw new Error("Failed to fetch");
        // const data = await response.json();
        // console.log(data);
        setRooms(response.data);
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    fetchRooms();
  }, []);

  const toggleDropdown = (roomId) => {
    setOpenDropdown(openDropdown === roomId ? null : roomId);
  };

  const applyFilters = (room) => {
    const currentDate = new Date();

    if (filterType === "vacant") {
      return room.bookings.length === 0;
    }

    if (filterType === "booked") {
      return room.bookings.length > 0;
    }

    if (filterType === "single" || filterType === "double") {
      return room.roomType.toLowerCase().includes(filterType);
    }

    if (filterType === "dateWindow" && startDate && endDate) {
      return room.bookings.some(
        (booking) =>
          new Date(booking.startDate) >= new Date(startDate) &&
          new Date(booking.endDate) <= new Date(endDate)
      );
    }

    if (filterType === "currentDate") {
      return room.bookings.some(
        (booking) =>
          new Date(booking.startDate) <= currentDate &&
          new Date(booking.endDate) >= currentDate
      );
    }

    return true; // No filter applied
  };

  const filteredRooms = rooms
  .filter((room) => {
    const matchesRoomNumber = room.roomNumber.toString().includes(searchQuery);
    const matchesUser = room.bookings.some((booking) =>
      booking.user.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return matchesRoomNumber || matchesUser; 
  })
  .filter(applyFilters);

  return (
    <div
      className="homePage min-h-screen flex flex-col justify-between bg-cover"
    >

      <div className="w-full flex h-screen overflow-hidden">

        <div className="w-full px-9 overflow-y-auto">
          <h1 className="text-3xl font-bold text-center my-6">Room Booking Details</h1>

          <div className="flex flex-wrap gap-4 justify-between mb-6">
            <input
              type="text"
              placeholder="Search by Room Number or User"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border rounded-lg p-2 w-1/3"
            />

            <select
              className="border rounded-lg p-2"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="noFilter">No Filter</option>
              <option value="vacant">Vacant Rooms</option>
              <option value="booked">Booked Rooms</option>
              <option value="single">Single Occupancy</option>
              <option value="double">Double Occupancy</option>
              <option value="dateWindow">Filter by Date Window</option>
              <option value="currentDate">Currently Booked</option>
            </select>

            {filterType === "dateWindow" && (
              <>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border rounded-lg p-2"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border rounded-lg p-2"
                />
              </>
            )}
          </div>

          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <div
                key={room._id}
                className="relative mb-6 p-4 border rounded-lg shadow-lg bg-white flex justify-between items-center"
              >
                <div>
                  <h2 className="text-xl font-semibold">Room {room.roomNumber}</h2>
                  <p className="text-gray-700">Type: {room.roomType}</p>
                </div>

                {room.bookings.length > 0 ? (
                  <div className="relative">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                      onClick={() => toggleDropdown(room._id)}
                    >
                      {openDropdown === room._id
                        ? "Hide Booking Details"
                        : "Show Booking Details"}
                    </button>

                    {openDropdown === room._id && (
                      <div className="absolute right-0 top-full mt-2 w-64 bg-gray-100 p-4 rounded-md shadow-lg z-50 border">
                        <h3 className="font-semibold text-lg">Upcoming Bookings:</h3>
                        <ul className="list-disc pl-5">
                          {room.bookings.map((booking) => (
                            <li key={booking._id} className="text-gray-600 mt-2">
                              <p>
                                <strong>User:</strong> {booking.user}
                              </p>
                              <p>
                                <strong>Booked from:</strong>{" "}
                                {new Date(booking.startDate).toLocaleDateString()}{" "}
                                <strong>to</strong>{" "}
                                {new Date(booking.endDate).toLocaleDateString()}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-green-600">No upcoming bookings</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-700">No rooms match your criteria</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RoomDataList;