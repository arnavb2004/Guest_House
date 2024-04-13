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
import { Button, Menu, MenuItem, Paper, Tooltip } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';

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
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const http = privateRequest(user.accessToken, user.refreshToken);
  
  const options = ["Name", "Email", "Contact", "Role"];
  const roles = ['USER', 'ADMIN','HOD','CHAIRMAN','DIRECTOR','DEAN','CASHIER','REGISTRAR','ASSOCIATE DEAN']
  const filterMap = {
    Name: "name",
    Email: "email",
    Contact: "contact",
    Role: "Role"
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

  const handleEdit = (userId) => (event) => {
    setAnchorEl(event.currentTarget);
    setSelectedUserId(userId);
  };
  const updateRole = async (role) => {
    try {
      const res = await http.put("/user/updateRole", { userId: selectedUserId, role });
      if (res.status === 200) {
        console.log(res.data.message);
        // Optionally, you can update the local state with the new user data
        // setUsers(users.map((user) => (user._id === selectedUserId ? res.data.user : user)));
      } else {
        toast(res.data.message);
      }
      handleClose();
    } catch (err) {
      if (err.response?.data?.message) {
        toast(err.response.data.message);
      } else {
        toast("An error occurred while updating the role.");
      }
    }
  };
  
  const handleClose = () => {
    setAnchorEl(null);
    setSelectedUserId(null);
  };

  const fetchUsers = async () => {
    try {
      const res = await http.get("/user/all");
      setValues(res.data.map((res) => res._id));
      setUsers(res.data);
      setNewUsers(res.data);
      setStatus("Success");
    } catch (err) {
      if (err.response?.data?.message) toast.errort(err.response.data.message);
      else toast.error("Error fetching users");
      setStatus("Error");
    }
  };

  useEffect(() => {
    setStatus("Loading");
    fetchUsers();
  }, []);

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
            style={{ backgroundColor: "#365899", color: "#FFF" }}
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
            checked.length > 0 && (
              <div className="flex gap-2">
                <IconButton edge="end" aria-label="comments">
                  <DeleteIcon className="text-gray-300" />
                </IconButton>
              </div>
            )
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
             <ListItemText
              id="checkbox-list-label-header"
              primary="Role"
            />
          </ListItemButton>
        </ListItem>
        {status === "Success" && newUsers.length > 0 && (
          <div className="h-96 overflow-y-auto">
            {newUsers.map((user) => {
              const labelId = `checkbox-list-label-${user._id}`;
              if (user.role === "ADMIN") return;
              return (
                <ListItem
                  key={user._id}
                  className="border-b"
                  secondaryAction={
                    <Tooltip title="Edit Role" placement="bottom">
                      <IconButton edge="end" aria-label="comments" onClick={handleEdit(user._id)}>
                        <EditIcon/>
                      </IconButton>
                    </Tooltip>
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
                     <ListItemText
                      id="checkbox-list-label-header"
                      primary={user.role}
                    />
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      PaperProps={{
                        style: {
                          maxHeight: 150,
                          width: 200,
                          boxShadow: '0 2px 3px rgba(0, 0, 0, 0.5)',
                        },
                      }}
                      MenuListProps={{
                        style: {
                          maxHeight: 150,
                          overflow: 'auto',
                        },
                      }}
                    >
                      {roles.map((role) => {
                        return (
                          <MenuItem onClick={() => updateRole(role)}>
                            {role}
                          </MenuItem>
                        )
                      })}
                    </Menu>
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
