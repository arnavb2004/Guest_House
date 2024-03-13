import React, { useEffect, useState } from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import CommentIcon from "@mui/icons-material/Comment";
import { useSelector, useDispatch } from "react-redux";
import { privateRequest } from "../utils/useFetch";
import { useNavigate } from "react-router-dom";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import tick from "../images/tick.png";
import cross from "../images/cross.png";
import { pickersFadeTransitionGroupClasses } from "@mui/x-date-pickers";
import Button from '@mui/material/Button';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import TextField from '@mui/material/TextField';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function RecordList({ status = "pending" }) {
  const [checked, setChecked] = useState([]);
  const [values, setValues] = useState([]);
  const user = useSelector((state) => state.user);
  const [records, setRecords] = useState([]);
  const [newRecords, setNewRecords] = useState([]);
  const filterMap = {
    "Guest Name": "guestName",
    "Number of Rooms": "numberOfRooms",
    "Number of Guests": "numberOfGuests",
    "Category": "category",
    "Arrival Date": "arrivalDate",
    "Departure Date": "departureDate",
    "Room Type": "roomType",
    "Status": "status",
  }

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
  // console.log(records);
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
  const [searchChoice, setSearchChoice] = useState("Filter");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };


  const filterRecords = ()=>{

    const tempRecords = records.filter((record)=>{
        if(typeof record[filterMap[searchChoice]] === "string") {

          if(searchChoice === "Arrival Date" || searchChoice === "Departure Date") {
            const date = new Date(record[filterMap[searchChoice]]);

            const year = date.getFullYear();
            const month = date.getMonth() + 1; // Months are zero-based, so add 1
            const day = date.getDate();

            const formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;

            return formattedDate.includes(searchTerm);
          } else {
            return record[filterMap[searchChoice]].toLowerCase().includes(searchTerm.toLowerCase());
          }

        } else {
          const inputNum = parseInt(searchTerm);
          const num = record[filterMap[searchChoice]];
          return num === inputNum;
        }
    })

    setNewRecords(tempRecords)

    console.log(tempRecords);
  }

  useEffect(() => {
    // if(searchTerm) {
    //   setNewRecords(records.filter((record) => {
    //     // console.log(record);
    //     // console.log(record[filterMap[searchChoice]]);
    //     // console.log(filterMap[searchChoice]);
    //     console.log(record[filterMap[searchChoice]]);

    //     // return record.filterMap[searchChoice].includes(searchTerm);
    //   }));
    // } else {
    //   setNewRecords(records);
    // }

    if(searchTerm) filterRecords();
    else setNewRecords(records)
  }, [searchTerm, searchChoice]);

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const toggleDropup = () => {
    if(isOpen) {
      setIsOpen(false);
    }
  };

  const options = ["Guest Name", "Number of Rooms", "Number of Guests", "Category", "Arrival Date", "Departure Date", "Room Type", "Status"]

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className=" flex p-5 px-0 w-full flex-col" onClick={toggleDropup}>
      <div className='text-center text-3xl font-["Dosis"] font-semibold py-4 uppercase'>
        User Records
      </div>
      <div className="grid grid-cols-12 gap-8 mb-4">
        <div className="col-span-2 flex flex-col justify-center relative h-full">
          <Button
            variant="contained"
            size="large"
            onClick={toggleDropdown}
            endIcon={isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            style={{ backgroundColor: "#DFDFDF", color: "#606060" }}
            className="h-full"
          >
            {searchChoice}
          </Button>
          {isOpen && (
            <div className="absolute top-12 z-10 mt-2 py-2 w-full bg-white border border-gray-300 rounded-md shadow-lg">
              {options.map((option) => (
                <button
                  // key={option.value}
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                  onClick={() => {
                    setSearchChoice(option);
                    setIsOpen(!isOpen);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="col-span-10 w-full p-2.5 border-2 border-slate-200 my-4 rounded-lg box-border focus:border-slate-400 focus:outline-none"
        /> */}
        <TextField 
          label="Search itmes" 
          variant="outlined" 
          className="col-span-10 w-full p-2.5 h-full" 
          value={searchTerm} 
          onChange={handleSearchChange}
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
            {user.role === "ADMIN" ? (
              <ListItemText
                id="checkbox-list-label-header"
                className="w-10"
                primary="Status"
              />
            ) : null}
          </ListItemButton>
        </ListItem>
        {newRecords.map((record) => {
          const labelId = `checkbox-list-label-${record._id}`;
        // {console.log(record);}
          return (
            <ListItem
              key={record._id}
              className="border-b"
              secondaryAction={
                <div>
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
                  className=" text-wrap w-10"
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
                {user.role === "ADMIN" ? (
                  <ListItemText
                    id="checkbox-list-label-header"
                    className="w-10"
                    primary={record.status}
                  />
                ) : null}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
