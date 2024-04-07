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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Button from "@mui/material/Button";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import TextField from "@mui/material/TextField";
import { getDate } from "../utils/handleDate";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";

export default function RecordList({ status = "pending" }) {
	const [checked, setChecked] = useState([]);
	const [values, setValues] = useState([]);
	const user = useSelector((state) => state.user);
	const [records, setRecords] = useState([]);
	const [newRecords, setNewRecords] = useState([]);
	const [loadingStatus, setLoadingStatus] = useState("Loading");
	const [sortType, setSortType] = useState("");
	const [sortToggle, setSortToggle] = useState(false);

	const filterMap = {
		"Guest Name": "guestName",
		"Number of Rooms": "numberOfRooms",
		"Number of Guests": "numberOfGuests",
		Category: "category",
		"Arrival Date": "arrivalDate",
		"Departure Date": "departureDate",
		"Room Type": "roomType",
	};

	const navigate = useNavigate();

	const makeRequest = privateRequest(user.accessToken, user.refreshToken);

  const fetchRecords = async () => {
    try {
      const res = await makeRequest.get("/reservation/" + status);
      const reservations = res.data;
      setValues(reservations.map((res) => res._id));
      setRecords(reservations);
      setNewRecords(reservations);
      setLoadingStatus("Success");
    } catch (err) {
      if (err.response?.data?.message) toast(err.response.data.message);
      setLoadingStatus("Error");
    }
  };
  useEffect(() => {
    setLoadingStatus("Loading");
    fetchRecords();
  }, [status]);
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

	const filterRecords = () => {
		const tempRecords = records.filter((record) => {
			if (typeof record[filterMap[searchChoice]] === "string") {
				if (
					searchChoice === "Arrival Date" ||
					searchChoice === "Departure Date"
				) {
					const date = new Date(record[filterMap[searchChoice]]);
					const formattedDate = getDate(date);

					return formattedDate.includes(searchTerm);
				} else {
					return record[filterMap[searchChoice]]
						.toLowerCase()
						.includes(searchTerm.toLowerCase());
				}
			} else {
				const inputNum = parseInt(searchTerm);
				const num = record[filterMap[searchChoice]];
				return num === inputNum;
			}
		});

		setNewRecords(tempRecords);

  };

	useEffect(() => {
		if (searchTerm) filterRecords();
		else setNewRecords(records);
	}, [searchTerm, searchChoice]);

	const [isOpen, setIsOpen] = useState(false);

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	const options = [
		"Guest Name",
		"Number of Rooms",
		"Number of Guests",
		"Category",
		"Arrival Date",
		"Departure Date",
		"Room Type",
	];

  const handleSortToggle = (event) => {
    const type = event.target.outerText;
    setSortType(type);
    setSortToggle(!sortToggle);
  };

  useEffect(() => {
    const handleSort = () => {
      const tempRecords = [...newRecords];
      if (sortToggle) {
        if (sortType === "Number of Guests") {
          tempRecords.sort((a, b) => {
            return a.numberOfGuests - b.numberOfGuests;
          });
        } else if (sortType === "Number of Rooms") {
          tempRecords.sort((a, b) => {
            return a.numberOfRooms - b.numberOfRooms;
          });
        } else if (sortType === "Category") {
          tempRecords.sort((a, b) => {
            if (a.category > b.category) return 1;
            else return -1;
          });
        } else if (sortType === "Arrival Date") {
          tempRecords.sort((a, b) => {
            return new Date(a.arrivalDate) - new Date(b.arrivalDate);
          });
        } else if (sortType === "Departure Date") {
          tempRecords.sort((a, b) => {
            return new Date(a.arrivalDate) - new Date(b.arrivalDate);
          });
        }
      } else {
        if (sortType === "Number of Guests") {
          tempRecords.sort((a, b) => {
            return b.numberOfGuests - a.numberOfGuests;
          });
        } else if (sortType === "Number of Rooms") {
          tempRecords.sort((a, b) => {
            return b.numberOfRooms - a.numberOfRooms;
          });
        } else if (sortType === "Category") {
          tempRecords.sort((a, b) => {
            if (b.category > a.category) return 1;
            else return -1;
          });
        } else if (sortType === "Arrival Date") {
          tempRecords.sort((a, b) => {
            return new Date(b.arrivalDate) - new Date(a.arrivalDate);
          });
        } else if (sortType === "Departure Date") {
          tempRecords.sort((a, b) => {
            return new Date(b.arrivalDate) - new Date(a.arrivalDate);
          });
        }
      }
      setNewRecords(tempRecords);
    };
    handleSort();
  }, [sortToggle, sortType]);

  return (
    <div className=" flex p-5 px-0 w-full flex-col">
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
          className=" bg-[#365899] text-white "
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
          <div className="p-2.5 px-4 flex w-full items-center">
            <ListItemIcon>
              <Checkbox
                edge="start"
                color="secondary"
                checked={checked.indexOf("#") !== -1}
                tabIndex={-1}
                onClick={handleToggle("#")}
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
              className=" text-wrap w-8 pr-2 text-center cursor-pointer"
              onClick={handleSortToggle}
              primary="Number of Guests"
            />
            <ListItemText
              id="checkbox-list-label-header"
              className=" text-wrap w-8 text-center cursor-pointer"
              onClick={handleSortToggle}
              primary="Number of Rooms"
            />
            <ListItemText
              id="checkbox-list-label-header"
              className=" text-wrap w-10 text-center cursor-pointer"
              onClick={handleSortToggle}
              primary="Category"
            />
            <ListItemText
              id="checkbox-list-label-header"
              className="w-20 text-center cursor-pointer"
              onClick={handleSortToggle}
              primary="Arrival Date"
            />
            <ListItemText
              id="checkbox-list-label-header"
              className="w-20 text-center cursor-pointer"
              onClick={handleSortToggle}
              primary="Departure Date"
            />
            <ListItemText
              id="checkbox-list-label-header"
              className="w-20 text-center"
              primary="Room Type"
            />
            <ListItemText
              id="checkbox-list-label-header "
              className="w-10 mr-14"
              primary="Status"
            />
          </div>
        </ListItem>
        {loadingStatus === "Success" && newRecords.length > 0 && (
          <div className="h-96 overflow-y-auto">
            {newRecords.map((record) => {
              const labelId = `checkbox-list-label-${record._id}`;
              return (
                <ListItem
                  key={record._id}
                  className="border-b"
                  secondaryAction={
                    <div className="flex gap-4">
                      <IconButton
                        edge="end"
                        onClick={() => {
                          status === "pending"
                            ? navigate(`${record._id}`)
                            : navigate(`../${record._id}`);
                        }}
                        aria-label="comments"
                      >
                        <InsertDriveFileIcon color="black" />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={async () => {
                          try {
                            const res = await makeRequest.get(
                              "/reservation/documents/" + record._id,
                              { responseType: "blob" }
                            );
                            var file = window.URL.createObjectURL(res.data);
                            window.location.assign(file);
                          } catch (error) {
                            toast.error("Something went wrong")
                          }
                        }}
                        aria-label="comments"
                      >
                        <DownloadIcon color="black" />
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
                      primary={getDate(record.arrivalDate)}
                    />
                    <ListItemText
                      id="checkbox-list-label-header"
                      className="w-20 text-center"
                      primary={getDate(record.departureDate)}
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
          </div>
        )}
      </List>
      {loadingStatus === "Loading" && (
        <div className="p-2 text-center pt-5 font-semibold">Loading...</div>
      )}
      {loadingStatus === "Success" && records.length === 0 && (
        <div className="p-2 text-center pt-5 font-semibold">
          No records found
        </div>
      )}
      {loadingStatus === "Error" && (
        <div className="p-2 text-center pt-5 font-semibold">
          Error fetching records!
        </div>
      )}
    </div>
  );
}
