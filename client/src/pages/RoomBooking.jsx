import React, { useEffect, useState } from "react";
import "./RoomBooking.css";
import { toast } from "react-toastify";
import { privateRequest } from "../utils/useFetch";
import { useSelector } from "react-redux";
import { getDate } from "../utils/handleDate";
import { useLocation, useParams } from "react-router-dom";
import Switch from "@mui/material/Switch";
import DeleteIcon from '@mui/icons-material/Delete';
import RoomList from "../components/RoomList";

const RoomBooking = () => {
  const params = useParams();

  const id = params.id;
  const userRecord = useLocation().state.userRecord;
  const guestName = userRecord.guestName
  const user = useSelector((state) => state.user);
  const makeRequest = privateRequest(user.accessToken, user.refreshToken);

  const fetchRooms = async () => {
    try {
      const res = await makeRequest.get("/reservation/rooms");
      const reservation = await makeRequest.get("/reservation/" + id);
      setRoomsData(res.data);
      setRoomList(reservation.data.reservation.bookings);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const convertToDate = (date) => {
    return new Date(new Date(date).toISOString());
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [roomsData, setRoomsData] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [startDate, setStartDate] = useState(
    new Date(userRecord.arrivalDate).toISOString().substring(0, 10)
  );
  const [endDate, setEndDate] = useState(
    new Date(userRecord.departureDate).toISOString().substring(0, 10)
  );
  const [roomList, setRoomList] = useState([]);
  const [occupancySwitch, setOccupancySwitch] = useState(false);

  console.log(startDate);
  console.log(roomList);

  console.log(roomsData);

  useEffect(() => {
    handleFilter();
  }, [startDate, endDate, occupancySwitch, roomsData]);

  const handleFilter = () => {
    try {
      if (endDate < startDate || endDate === "" || startDate === "") {
        toast.error("Enter Valid endDate and startDate");
        return;
      }

      // Filter the rooms based on the date range
      const updatedRooms = roomsData.map((room) => {
        const filteredBookings = room.bookings.filter((booking) => {
          return (
            convertToDate(booking.startDate) < convertToDate(endDate) &&
            convertToDate(booking.endDate) > convertToDate(startDate)
          );
        });
        console.log(filteredBookings);
        return { ...room, bookings: filteredBookings };
      });

      // Set the rooms state to the filtered rooms
      setRooms(
        updatedRooms.filter(
          (room) =>
            room.type ===
            (occupancySwitch ? "Double Occupancy" : "Single Occupancy")
        )
      );

      // toast.success("Filtered!!");
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
        if (
          room.roomNumber === currRoom.roomNumber &&
          convertToDate(currRoom.startDate) < convertToDate(endDate) &&
          convertToDate(currRoom.endDate) > convertToDate(startDate)
        ) {
          temp = true;
        }
      });

      if (temp) {
        toast.error("Room already added for this period");
        return;
      }

      let present = false;

      let newRoom = {
        user: guestName,
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

  const deleteRoom = (room) => {
    const updatedRoomList = roomList.filter(currRoom => currRoom !== room)
    setRoomList(updatedRoomList)
  }

  return (
    <div className="room-booking h-fit ">
      <h2 className="room-heading text-4xl font-bold">Room Booking</h2>
      <div className="filter-container">
        <div className="px-4">
          Single Occupancy
          <Switch
            checked={occupancySwitch}
            onChange={(e) => setOccupancySwitch(e.target.checked)}
          />
          Double Occupancy
        </div>
        <div>
          <label className="filter-label">Start Date:</label>
          <input
            type="date"
            value={startDate.substring(0, 10)}
            max={endDate.substring(0, 10)}
            onChange={(e) =>
              setStartDate(new Date(e.target.value).toISOString())
            }
            className="filter-input"
          />
          <label className="filter-label">End Date:</label>
          <input
            type="date"
            value={endDate.substring(0, 10)}
            min={startDate.substring(0, 10)}
            onChange={(e) => setEndDate(new Date(e.target.value).toISOString())}
            className="filter-input"
          />
          {/* <button onClick={handleFilter} className="filter-button">
            Filter
          </button> */}
        </div>
      </div>
      <div className="room-grid">
        {rooms.map((room) => (
          <div
            key={room.id}
            className={`room ${
              room.bookings.length > 0
                ? "booked-during-range cursor-not-allowed rounded-lg bg-[rgb(191,190,190)] text-white"
                : "available cursor-pointer border-[3px] hover:bg-green-500 border-green-500 rounded-lg"
            } ${room.type === "Single Occupancy" ? "" : ""}`}
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
                    <div key={"info-" + room.roomNumber} className="py-1">
                      <p>
                        Booked from: {getDate(booking.startDate)} to{" "}
                        {getDate(booking.endDate)}
                      </p>
                      <p>User: {booking.user}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* {roomList.length > 0 && (
        <div className="room-list  flex flex-col gap-4 m-4 p-2 h-1/8 overflow-y-scroll">
          <div className="flex justify-center text-3xl font-bold">
            Room List
          </div>
          <div className="grid grid-cols-12">
            <div className="col-span-3 font-semibold text-xl">Arrival Date</div>
            <div className="col-span-3 font-semibold text-xl">
              Departure Date
            </div>
            <div className="col-span-5 font-semibold text-xl">Room Number</div>
          </div>
          {roomList.map((room) => {
            return (
              <div className="grid grid-cols-12">
                <div className="col-span-3">{getDate(room.startDate)}</div>
                <div className="col-span-3">{getDate(room.endDate)}</div>
                <div className="col-span-5">{room.roomNumber}</div>
                <div className="col-span-1">
                  <DeleteIcon className="text-gray-700 cursor-pointer" onClick={() => {deleteRoom(room)}}/>
                </div>
              </div>
            );
          })}
          <div className="flex justify-center">
            <button
              className="p-2 w-fit bg-[rgb(54,88,153)]  rounded-lg text-white mr-16"
              onClick={async () => {
                try {
                  await makeRequest.put("/reservation/rooms/" + id, roomList);
                  window.location.reload();
                } catch (err) {
                  console.log(err.response.data.message);
                }
              }}
            >
              Assign Rooms
            </button>
          </div>
        </div>
      )} */}
      <RoomList roomList={ roomList } setRoomList={setRoomList} id={id}/>
    </div>
  );
};

export default RoomBooking;
