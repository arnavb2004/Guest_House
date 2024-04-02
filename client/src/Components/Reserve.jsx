import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import "./reserve.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Reserve = ({ setOpen, hotelId }) => {
  const [selectedRooms, setSelectedRooms] = useState([]);

  const [rooms, setRooms] = useState([]);

  const data = [
    {
      roomNumbers: [
        {
          _id: "1",
          number: 101,
          unavailableDates: ["2022-03-01", "2022-03-02", "2022-03-03"],
        },
        {
          _id: "2",
          number: 102,
          unavailableDates: ["2022-03-01", "2022-03-02", "2022-03-03"],
        },
        {
          _id: "3",
          number: 103,
          unavailableDates: ["2022-03-01", "2022-03-02", "2022-03-03"],
        },
        {
          _id: "4",
          number: 104,
          unavailableDates: [],
        },
      ],
    },
  ];

  const dates = [
    { startDate: "2022-03-01", endDate: "2022-03-02" },
    { startDate: "2022-03-03", endDate: "2022-03-04" },
    { startDate: "2022-03-05", endDate: "2022-03-06" },
  ];


  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const dates = [];

    const date = new Date(start.getTime());

    while (date <= end) {
      dates.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };

  const alldates = getDatesInRange(dates[0].startDate, dates[0].endDate);

  const isAvailable = (roomNumber) => {
    const isFound = roomNumber.unavailableDates.some((date) =>
      alldates.includes(new Date(date).getTime())
    );

    return !isFound;
  };

  const handleSelect = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedRooms(
      checked
        ? [...selectedRooms, value]
        : selectedRooms.filter((item) => item !== value)
    );
  };

  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      await Promise.all(
        selectedRooms.map((roomId) => {
          const res = axios.put(`/rooms/availability/${roomId}`, {
            dates: alldates,
          });
          return res.data;
        })
      );
      setOpen(false);
      navigate("/");
    } catch (err) {}
  };
  return (
    <div className="reserve">
      <div className="rContainer">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />
        <span>Select your rooms:</span>
        {data.map((item) => (
          <div className="rItem" key="key">
            <div className="rSelectRooms">
              {item.roomNumbers.map((roomNumber) => (
                <div className="room">
                  <label>{roomNumber.number}</label>
                  <input
                    type="checkbox"
                    value={roomNumber._id}
                    onChange={handleSelect}
                    disabled={!isAvailable(roomNumber)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <button onClick={handleClick} className="rButton">
          Reserve Now!
        </button>
      </div>
    </div>
  );
};

export default Reserve;
