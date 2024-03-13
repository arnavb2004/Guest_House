import React, {useEffect, useState } from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { useSelector,useDispatch } from "react-redux";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import CommentIcon from "@mui/icons-material/Comment";
import { privateRequest } from "../utils/useFetch";
export default function UserList() {
  const [checked, setChecked] = useState([]);
  const [values, setValues] = useState([0, 1, 2, 3]);
  const user= useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
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
  const makeRequest=privateRequest(user.accessToken,user.refreshToken)
  const fetchUsers = async () => {
    try {
      const res = await makeRequest.get("/user/all");
      console.log(res.data);
      setUsers(res.data);
    } catch (err) {
      // toast(err.response.data);
      console.log(err.response.data);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className=" flex p-5 px-0 w-full">
      <List sx={{ width: "100%", padding: "0px" }} className="bg-gray-50 rounded-md overflow-hidden">
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
          <ListItemButton role={undefined} onClick={handleToggle("#")} dense sx={{paddingY:"10px"}}>
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
                  sx={{overflow: "hidden"}}
                  primary="Name"
                />
            <ListItemText
              id="checkbox-list-label-header"
              className="w-18 ml-10"
              primary="Email"
            />
            <ListItemText
              id="checkbox-list-label-header"
              primary="Contact"
            />
            {/* <ListItemText id="checkbox-list-label-header" primary="Category" /> */}
            <ListItemText
              id="checkbox-list-label-header"
              primary="Pending requests"
            />
            {/* <ListItemText
              id="checkbox-list-label-header"
              primary="Departure Date"
            /> */}
            {/* <ListItemText id="checkbox-list-label-header" primary="Room type" /> */}
          </ListItemButton>
        </ListItem>
        {console.log("Users will be printed here!!")}
        {console.log(users)}
        {users.map((user) => {
          const labelId = `checkbox-list-label-${user._id}`;
          if (user.role === "ADMIN")
            return;
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
                sx={{paddingY:"10px"}}
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
                {/* <ListItemText id={labelId} primary={`Line item ${value + 1}`} /> */}
                <ListItemText
                  id="checkbox-list-label-header"
                  className=" text-wrap w-12 mr-5" 
                  sx={{overflow: "hidden"}}
                  primary={`${user.name}`}
                />
                <ListItemText
                  id="checkbox-list-label-header"
                  className="w-14"
                  primary={`${user.email}`}
                />
                {/* <ListItemText
                  id="checkbox-list-label-header"
                  primary="Number of rooms"
                /> */}
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
                {/* <ListItemText
                  id="checkbox-list-label-header"
                  primary="Departure Date"
                /> */}
                {/* <ListItemText
                  id="checkbox-list-label-header"
                  primary="Room type"
                /> */}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
