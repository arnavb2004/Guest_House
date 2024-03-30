import React, { useEffect, useState } from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { useSelector, useDispatch } from "react-redux";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import CommentIcon from "@mui/icons-material/Comment";
import { privateRequest } from "../utils/useFetch";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { Button } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import TextField from "@mui/material/TextField";
import DeleteIcon from '@mui/icons-material/Delete';

export default function UserList() {
  const [checked, setChecked] = useState([]);
  const [values, setValues] = useState([]);
  const user = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [newUsers, setNewUsers] = useState([]);
  const [status, setStatus] = useState("Loading");

  const [searchTerm, setSearchTerm] = useState("");
  const [searchChoice, setSearchChoice] = useState("Filter");
  const [isOpen, setIsOpen] = useState(false);
  const [showRemove, setShowRemove] = useState(false);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const options = ["Name", "Email", "Contact"];
  const filterMap = {
    Name: "name",
    Email: "email",
    Contact: "contact",
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const filterUsers = () => {
    const tempUsers = users.filter((user) => {
      return user[filterMap[searchChoice]]
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
    setNewUsers(tempUsers);
  };

  useEffect(() => {
    if (searchTerm) {
      filterUsers();
    } else {
      setNewUsers(users);
    }
  }, [searchTerm, searchChoice]);

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
  const makeRequest = privateRequest(user.accessToken, user.refreshToken);
  const fetchUsers = async () => {
    try {
      const res = await makeRequest.get("/user/all");
      // console.log(res.data)
      setValues(res.data.map((res) => res._id));
      setUsers(res.data);
      setNewUsers(res.data);
      setStatus("Success");
    } catch (err) {
      toast(err.response.data);
      setStatus("Error");
      console.log(err.response.data);
    }
  };

  useEffect(() => {
    setStatus("Loading");
    fetchUsers();
  }, []);

  console.log(checked)

  return (
    <div className="flex flex-col p-5 px-0 w-full">
      <div className='text-center text-3xl font-["Dosis"] font-semibold py-4 uppercase'>
        Users
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
        <TextField
          label="Search items"
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
            checked.length > 0 && <div className="flex gap-2">
              <IconButton edge="end" aria-label="comments">
                <DeleteIcon
                  className="text-gray-300"
                />
              </IconButton>
            </div>
          }
          disablePadding
        >
          <ListItemButton
            role={undefined}
            onClick={handleToggle("#")}
            dense
            sx={{ paddingY: "10px" }}
          >
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={checked.indexOf("#") !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{ "aria-labelledby": "checkbox-list-label-header" }}
              />
            </ListItemIcon>
            <ListItemText
              id="checkbox-list-label-header"
              className=" text-wrap w-14 mr-5"
              sx={{ overflow: "hidden" }}
              primary="Name"
            />
            <ListItemText
              id="checkbox-list-label-header"
              className="w-18 ml-10"
              primary="Email"
            />
            <ListItemText id="checkbox-list-label-header" primary="Contact" />
            <ListItemText
              id="checkbox-list-label-header"
              primary="Pending requests"
            />
          </ListItemButton>
        </ListItem>
        {status === "Success" && newUsers.length > 0 && (
          <div className="h-96 overflow-y-scroll">
            {newUsers.map((user) => {
              const labelId = `checkbox-list-label-${user._id}`;
              if (user.role === "ADMIN") return;
              return (
                <ListItem
                  key={user._id}
                  className="border-b"
                  secondaryAction={
                    <IconButton edge="end" aria-label="comments">
                      <CommentIcon />
                    </IconButton>
                  }
                  disablePadding
                >
                  <ListItemButton
                    className=""
                    sx={{ paddingY: "10px" }}
                    role={undefined}
                    onClick={handleToggle(user._id)}
                    dense
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={checked.indexOf(user._id) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      id="checkbox-list-label-header"
                      className=" text-wrap w-12 mr-5"
                      sx={{ overflow: "hidden" }}
                      primary={`${user.name}`}
                    />
                    <ListItemText
                      id="checkbox-list-label-header"
                      className="w-14"
                      primary={`${user.email}`}
                    />
                    <ListItemText
                      id="checkbox-list-label-header"
                      className="w-10"
                      primary={user.contact}
                    />
                    <ListItemText
                      id="checkbox-list-label-header"
                      className=""
                      primary="0 requests pending"
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </div>
        )}
        {status === "Loading" && (
          <div className="p-2 text-center pt-5 font-semibold">Loading...</div>
        )}
        {status === "Success" && users.length === 0 && (
          <div className="p-2 text-center pt-5 font-semibold">
            No records found
          </div>
        )}
        {status === "Error" && (
          <div className="p-2 text-center pt-5 font-semibold">
            Error fetching records!
          </div>
        )}
      </List>
    </div>
  );
}
