import React, { useEffect, useState } from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getDate } from "../utils/handleDate";
import { privateRequest } from "../utils/useFetch";
import "react-toastify/dist/ReactToastify.min.css";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

export default function RoomList({ roomList, setRoomList, id }) {
  const deleteRoom = (room) => {
    const updatedRoomList = roomList.filter((currRoom) => currRoom !== room);
    setRoomList(updatedRoomList);
  };
  const user = useSelector((state) => state.user);
  const makeRequest = privateRequest(user.accessToken, user.refreshToken);
  const navigate = useNavigate();
  return (
    <>
      {roomList.length > 0 && (
        <div className="room-list flex flex-col gap-4 m-4 p-2 h-1/8 overflow-y-scroll">
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
                  <DeleteIcon
                    className="text-gray-700 cursor-pointer"
                    onClick={() => {
                      deleteRoom(room);
                    }}
                  />
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
                  if (err.response?.data?.message)
                    toast.error(err.response.data.message);
                  else {
                    toast.error(
                      "Something went wrong. Please try again later."
                    );
                  }
                }
              }}
            >
              Assign Rooms
            </button>
          </div>
        </div>
      )}
    </>
  );
}
