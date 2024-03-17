import React, { useEffect, useState } from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import { useSelector, useDispatch } from "react-redux";
import { privateRequest } from "../utils/useFetch";
import { useNavigate } from "react-router-dom";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import tick from "../images/tick.png";
import cross from "../images/cross.png";

export default function AdminRecordList({ status = "pending" }) {
  const [checked, setChecked] = useState([]);
  const [values, setValues] = useState([]);
  const user = useSelector((state) => state.user);
  const [records, setRecords] = useState([]);

  const navigate = useNavigate();

  const makeRequest = privateRequest(user.accessToken, user.refreshToken);
  console.log(makeRequest);

  const fetchRecords = async () => {
    try {
      const res = await makeRequest.get("/reservation/" + status);
      console.log(res.data);
      const reservations = res.data;
      setValues(reservations.map((res) => res._id));
      setRecords(reservations);
    } catch (err) {
      // toast(err.response.data);
      console.log(err.response.data);
    }
  };
  //console.log(records);
  useEffect(() => {
    fetchRecords();
  }, [status]);
  console.log(records);
  const dispatch = useDispatch();
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);

    if (value === "#") {
      if (currentIndex === -1) {
        setChecked([...values, "#"]);
      } else {
        setChecked([]);
      }

      return;
    }

    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className=" flex p-5 px-0 w-full flex-col">
      <div className='text-center text-3xl font-["Dosis"] font-semibold py-4 uppercase'>
        User Records
      </div>
      <div>
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-2.5 border-2 border-slate-200 my-4 rounded-lg box-border focus:border-slate-400 focus:outline-none"
        />
      </div>
      <List
        sx={{ width: "100%", padding: "0px" }}
        className="bg-gray-50 rounded-md overflow-hidden"
      >
        <ListItem
          className=" bg-[#365899] text-white"
          key="#"
          secondaryAction={
            <IconButton edge="end" aria-label="comments">
              {/* <CommentIcon /> */}
            </IconButton>
          }
          disablePadding
        >
          <ListItemButton
            role={undefined}
            dense
            onClick={handleToggle("#")}
            sx={{ paddingY: "10px" }}
          >
            <ListItemIcon>
              <Checkbox
                edge="start"
                color="secondary"
                checked={checked.indexOf("#") !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{ "aria-labelledby": "checkbox-list-label-header" }}
              />
            </ListItemIcon>
            <ListItemText
              id="checkbox-list-label-header"
              className=" text-wrap w-12"
              sx={{ overflow: "hidden" }}
              primary="Name"
            />
            <ListItemText
              id="checkbox-list-label-header"
              className=" text-wrap w-8 text-center"
              primary="Number of Guests"
            />
            <ListItemText
              id="checkbox-list-label-header"
              className=" text-wrap w-8 text-center"
              primary="Number of Rooms"
            />
            <ListItemText
              id="checkbox-list-label-header"
              className=" text-wrap w-10 text-center"
              primary="Category"
            />
            <ListItemText
              id="checkbox-list-label-header"
              className="w-20 text-center"
              primary="Arrival Date"
            />
            <ListItemText
              id="checkbox-list-label-header"
              className="w-20 text-center"
              primary="Departure Date"
            />
            <ListItemText
              id="checkbox-list-label-header"
              className="w-20 text-center"
              primary="Room Type"
            />
            <ListItemText
              id="checkbox-list-label-header"
              className="w-10"
              primary="Status"
            />
          </ListItemButton>
        </ListItem>
        {console.log(records)}
        {records.map((record) => {
          const labelId = `checkbox-list-label-${record._id}`;

          return (
            <ListItem
              key={record._id}
              className="border-b"
              secondaryAction={
                <div className="">
                  <IconButton edge="end" aria-label="comments">
                    <img
                      className="h-5"
                      onClick={async () => {
                        await makeRequest.put(
                          "/reservation/approve/" + record._id
                        );
                      }}
                      src={tick}
                    />
                  </IconButton>
                  <IconButton edge="end" aria-label="comments">
                    <img
                      className="h-5"
                      onClick={async () => {
                        await makeRequest.put(
                          "/reservation/reject/" + record._id
                        );
                      }}
                      src={cross}
                    />
                  </IconButton>
                  <IconButton edge="end" aria-label="comments">
                    <InsertDriveFileIcon
                      color="black"
                      onClick={() => navigate(`${record._id}`)}
                    />
                  </IconButton>
                </div>
              }
              disablePadding
            >
              <ListItemButton
                className=""
                sx={{ paddingY: "10px" }}
                onClick={handleToggle(record._id)}
                role={undefined}
                dense
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={checked.indexOf(record._id) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </ListItemIcon>

                <ListItemText
                  id="checkbox-list-label-header"
                  className=" text-wrap w-12"
                  sx={{ overflow: "hidden" }}
                  primary={record.guestName}
                />
                <ListItemText
                  id="checkbox-list-label-header"
                  className=" text-wrap w-10 text-center"
                  primary={record.numberOfGuests}
                />
                <ListItemText
                  id="checkbox-list-label-header"
                  className=" text-wrap w-10 text-center"
                  primary={record.numberOfRooms}
                />
                <ListItemText
                  id="checkbox-list-label-header"
                  className=" text-wrap w-10 text-center"
                  primary={record.category}
                />
                <ListItemText
                  id="checkbox-list-label-header"
                  className="w-20 text-center"
                  primary={new Date(record.arrivalDate).toLocaleDateString()}
                />
                <ListItemText
                  id="checkbox-list-label-header"
                  className="w-20 text-center"
                  primary={new Date(record.departureDate).toLocaleDateString()}
                />
                <ListItemText
                  id="checkbox-list-label-header"
                  className="w-20 text-center"
                  primary={record.roomType}
                />
                <ListItemText
                  id="checkbox-list-label-header"
                  className="w-10"
                  primary={record.status}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
