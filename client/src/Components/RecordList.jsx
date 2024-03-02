import React, { useState } from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import CommentIcon from "@mui/icons-material/Comment";

export default function RecordList() {
  const [checked, setChecked] = useState([]);
  const [values, setValues] = useState([0, 1, 2, 3]);

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

  return (
    <div className=" flex items-center justify-center p-5 w-5/6">
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
                  className=" text-wrap w-10 mr-5" 
                  sx={{overflow: "hidden"}}
                  primary="Name"
                />
            <ListItemText
              id="checkbox-list-label-header"
              primary="Number of guests"
            />
            <ListItemText
              id="checkbox-list-label-header"
              primary="Number of rooms"
            />
            <ListItemText id="checkbox-list-label-header" primary="Category" />
            <ListItemText
              id="checkbox-list-label-header"
              primary="Arrival Date"
            />
            <ListItemText
              id="checkbox-list-label-header"
              primary="Departure Date"
            />
            <ListItemText id="checkbox-list-label-header" primary="Room type" />
          </ListItemButton>
        </ListItem>

        {values.map((value) => {
          const labelId = `checkbox-list-label-${value}`;

          return (
            <ListItem
              key={value}
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
                onClick={handleToggle(value)}
                dense
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={checked.indexOf(value) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </ListItemIcon>
                {/* <ListItemText id={labelId} primary={`Line item ${value + 1}`} /> */}
                <ListItemText
                  id="checkbox-list-label-header"
                  className=" text-wrap w-10 mr-5" 
                  sx={{overflow: "hidden"}}
                  primary="Namevnsndsndkdjsnvkkjk"
                />
                <ListItemText
                  id="checkbox-list-label-header"
                  primary="Number of guests"
                />
                <ListItemText
                  id="checkbox-list-label-header"
                  primary="Number of rooms"
                />
                <ListItemText
                  id="checkbox-list-label-header"
                  primary="Category"
                />
                <ListItemText
                  id="checkbox-list-label-header"
                  primary="Arrival Date"
                />
                <ListItemText
                  id="checkbox-list-label-header"
                  primary="Departure Date"
                />
                <ListItemText
                  id="checkbox-list-label-header"
                  primary="Room type"
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
