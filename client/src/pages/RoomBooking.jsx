import React, { useEffect, useState } from "react";
import "./RoomBooking.css";
import { toast } from "react-toastify";
import { privateRequest } from "../utils/useFetch";
import { useSelector } from "react-redux";
import { getDate } from "../utils/handleDate";
import { useLocation, useParams } from "react-router-dom";

const RoomBooking = () => {

  const params = useParams()

  const id = params.id;
  const user = useSelector((state) => state.user);
  const makeRequest = privateRequest(user.accessToken, user.refreshToken);

  const fetchRooms = async () => {
    try {
      const res = await makeRequest.get("/reservation/rooms");
      const reservation = await makeRequest.get("/reservation/"+id);
      setRoomsData(res.data);
      setRooms(res.data);
      setRoomList(reservation.data.reservation.bookings)
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const [roomsData, setRoomsData] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [startDate, setStartDate] = useState(new Date().toISOString());
  const [endDate, setEndDate] = useState(new Date().toISOString());
  const [roomList, setRoomList] = useState([]);

  console.log(startDate)
  console.log(roomList);

  const handleFilter = () => {
    try {
      if (endDate < startDate || endDate === "" || startDate === "") {
        toast.error("Enter Valid endDate and startDate");
        return;
      }

      // Filter the rooms based on the date range
      const updatedRooms = roomsData.map((room) => {
        const filteredBookings = room.bookings.filter((booking) => {
          console.log(booking);
          console.log(new Date(booking.startDate))
          console.log(startDate)
          return booking.startDate <= endDate && booking.endDate >= startDate;
        });
        console.log(filteredBookings);
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

  const addRoom = (room) => {
    if (startDate && endDate) {
      let tempRoomList = [...roomList];

      let temp = false;
      tempRoomList.forEach((currRoom) => {
        if (currRoom.startDate >= startDate && currRoom.endDate <= endDate) {
          temp = true;
        }
      });

      if (temp) {
        setRoomList(tempRoomList);
        return;
      }

      let present = false;

      let newRoom = {
        id: room.id,
        startDate,
        endDate,
        roomNumber: room.roomNumber,
      };

      const updatedRoomList = tempRoomList.map((currRoom) => {
        if (currRoom.roomNumber === room.roomNumber && !present) {
          present = true;
          return newRoom;
        }
        return currRoom;
      });

      if (!present) {
        setRoomList((prev) => [...prev, newRoom]);
      } else {
        setRoomList(updatedRoomList);
      }
    } else if (startDate) {
      toast.error("Please give End Date");
    } else if (endDate) {
      toast.error("Please give Start Date");
    } else {
      toast.error("Select Start, End Date");
    }
  };

  console.log(rooms);

  return (
    <div className="room-booking">
      <h2 className="room-heading text-4xl font-bold">Room Booking</h2>
      <div className="filter-container">
        <label className="filter-label">Start Date:</label>
        <input
          type="date"
          value={startDate.substring(0,10)}
          onChange={(e) => setStartDate(new Date(e.target.value).toISOString())}
          className="filter-input"
        />
        <label className="filter-label">End Date:</label>
        <input
          type="date"
          value={endDate.substring(0,10)}
          onChange={(e) => setEndDate(new Date(e.target.value).toISOString())}
          className="filter-input"
        />
        <button onClick={handleFilter} className="filter-button">
          Filter
        </button>
      </div>
      <div className="room-grid">
        {rooms.map((room) => (
          <div
            key={room.id}
            className={`room ${
              room.bookings.length > 0
                ? "booked-during-range cursor-not-allowed rounded-lg bg-[rgb(191,190,190)] text-white"
                : "available cursor-pointer border-[3px] hover:bg-green-500 border-green-500 rounded-lg"
            }`}
          >
            <div
              className="room-info"
              onClick={() => {
                addRoom(room);
              }}
            >
              <h3>{room.roomNumber}</h3>
              {room.bookings.length > 0 && (
                <div className="booking-info">
                  {room.bookings.map((booking) => (
                    <div key={room.roomNumber} className="py-1">
                      <p>
                        Booked from: {getDate(booking.startDate)} to{" "}
                        {getDate(booking.endDate)}
                      </p>
                      {/* <p>User: {booking.user}</p> */}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {roomList.length > 0 && (
        <div className="room-list  flex flex-col gap-4 m-4 p-2">
          <div className="flex justify-center text-3xl font-bold">
            Room List
          </div>
          <div className="grid grid-cols-12">
            <div className="col-span-3 font-semibold text-xl">Arrival Date</div>
            <div className="col-span-3 font-semibold text-xl">
              Departure Date
            </div>
            <div className="col-span-6 font-semibold text-xl">Room Number</div>
          </div>
          {roomList.map((room) => {
            return (
              <div className="grid grid-cols-12">
                <div className="col-span-3">{getDate(room.startDate)}</div>
                <div className="col-span-3">{getDate(room.endDate)}</div>
                <div className="col-span-6">{room.roomNumber}</div>
              </div>
            );
          })}
          <div className="flex justify-center">
            <button
              className="p-2 w-fit bg-[rgb(54,88,153)]  rounded-lg text-white mr-16"
              onClick={async () => {
                await makeRequest.put("/reservation/rooms/"+id, roomList);
                window.location.reload()
              }}
            >
              Assign Rooms
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomBooking;
