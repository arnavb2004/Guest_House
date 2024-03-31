import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios"; // Assuming you use axios for API requests
import Workflow from "../components/Workflow";
import { privateRequest } from "../utils/useFetch";
import { Checkbox } from "@mui/material";
import { getDate, getTime } from "../utils/handleDate";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

export default function AdminRecordPage() {
  const { id } = useParams();

  const user = useSelector((state) => state.user);

  const makeRequest = privateRequest(user.accessToken, user.refreshToken);

  const [status, setStatus] = useState("Loading");

  const color = {
    PENDING: "gray-400",
    APPROVED: "green-400",
    REJECTED: "red-400",
    HOLD: "yellow-400",
  };

  const [reviewers, setReviewers] = useState([]);

  const [userRecord, setUserRecord] = useState({
    guestName: "",
    address: "",
    numberOfGuests: "",
    numberOfRooms: "",
    roomType: "",
    arrivalDate: "",
    departureDate: "",
    purpose: "",
    category: "",
  });
  const [checkedValues, setCheckedValues] = useState([]);

  const roles = [
    "DIRECTOR",
    "HOD",
    "DEAN",
    "REGISTRAR",
    "CHAIRMAN",
    "ASSOCIATE DEAN",
  ];

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await makeRequest.get(`/reservation/${id}`);
        console.log(response.data);
        setStatus("Success");
        setUserRecord(response.data.reservation);
        setReviewers(response.data.reservation.reviewers);
        setCheckedValues(
          response.data.reservation.reviewers.map(
            (reviewer) => reviewer.role
          ) || []
        );
      } catch (error) {
        setStatus("Error");
        console.error("Error fetching user data:", error);
      }
    };

    fetchRecord();
  }, [id]);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setCheckedValues((prevCheckedValues) => [...prevCheckedValues, value]);
    } else {
      setCheckedValues((prevCheckedValues) =>
        prevCheckedValues.filter((item) => item !== value)
      );
    }
  };

  if (status === "Error") return <Navigate to="/404" />;
  else if (status === "Loading") return <div>Loading...</div>;

  return (
    <>
      <div className="grid grid-cols-8 m-9 gap-4">
        <Workflow
          id={id}
          userRecord={userRecord}
          setUserRecord={setUserRecord}
          reviewers={reviewers}
          setReviewers={setReviewers}
        />

        <div className='col-span-5 shadow-lg flex flex-col justify-center gap-4 font-["Dosis"]'>
          <div className="flex justify-between px-32">
            <p className="p-2 text-xl font-semibold">Guest Name:</p>
            <p className="p-2 text-lg">{userRecord.guestName}</p>
          </div>
          <hr />
          <div className="flex justify-between px-32">
            <p className="p-2 text-xl font-semibold">Address:</p>
            <p className="p-2 text-lg">{userRecord.address}</p>
          </div>
          <hr />
          <div className="flex justify-between px-32">
            <p className="p-2 text-xl font-semibold">Number Of Guests:</p>
            <p className="p-2 text-lg">{userRecord.numberOfGuests}</p>
          </div>
          <hr />
          <div className="flex justify-between px-32">
            <p className="p-2 text-xl font-semibold">Number Of Rooms:</p>
            <p className="p-2 text-lg">{userRecord.numberOfRooms}</p>
          </div>
          <hr />
          <div className="flex justify-between px-32">
            <p className="p-2 text-xl font-semibold">Room Type</p>
            <p className="p-2 text-lg">{userRecord.roomType}</p>
          </div>
          <hr />
          <div className="flex justify-between px-32">
            <p className="p-2 text-xl font-semibold">Arrival Date</p>
            <p className="p-2 text-lg">{getDate(userRecord.arrivalDate)}</p>
          </div>
          <hr />
          <div className="flex justify-between px-32">
            <p className="p-2 text-xl font-semibold">Arrival Time:</p>
            <p className="p-2 text-lg">{getTime(userRecord.arrivalDate)}</p>
          </div>
          <hr />
          <div className="flex justify-between px-32">
            <p className="p-2 text-xl font-semibold">Departure Date:</p>
            <p className="p-2 text-lg">{getDate(userRecord.departureDate)}</p>
          </div>
          <hr />
          <div className="flex justify-between px-32">
            <p className="p-2 text-xl font-semibold">Departure Time:</p>
            <p className="p-2 text-lg">{getTime(userRecord.departureDate)}</p>
          </div>
          <hr />
          <div className="flex justify-between px-32">
            <p className="p-2 text-xl font-semibold">Purpose:</p>
            <p className="p-2 text-lg">{userRecord.purpose}</p>
          </div>
          <hr />
          <div className="flex justify-between px-32 pb-5">
            <p className="p-2 text-xl font-semibold">Category:</p>
            <p className="p-2 text-lg">{userRecord.category}</p>
          </div>
        </div>
      </div>
      {user.role === "ADMIN" && (
        <div className='col-span-5 shadow-lg flex justify-between  p-5  gap-4 m-9 font-["Dosis"]'>
          <div>
            <div className="text-2xl font-semibold font-['Dosis'] px-5">
              Reviewers
            </div>
            <div className="p-5">
              <ul>
                {roles.map((role) => (
                  <li key={role}>
                    <input
                      type="checkbox"
                      id={role}
                      checked={checkedValues.includes(role)}
                      value={role}
                      onChange={handleCheckboxChange}
                    />
                    <label className="px-2 text-lg" htmlFor={role}>
                      {role}
                    </label>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => {
                  console.log(checkedValues);
                  try {
                    const res = makeRequest.put(`/reservation/${id}/assign`, {
                      reviewers: checkedValues,
                    });
                    toast.success("Assigned Successfully");
                  } catch (error) {
                    toast.error("Error Assigning Reviewers");
                  }
                }}
                className="p-3 px-4  mt-8 bg-[rgb(54,88,153)] rounded-lg text-white"
              >
                ASSIGN
              </button>
            </div>
          </div>
          <div>
            <div className="text-2xl font-semibold font-['Dosis'] px-5">
              Status
            </div>
            <div className="p-5 flex flex-col gap-4 ">
              {reviewers.map((reviewer) => (
                <div className="flex gap-4 w-max">
                  <div className="w-20">{reviewer.role}</div>
                  <div
                    className={
                      "border relative top-1 w-5 h-5 bg-" +
                      color[reviewer.status]
                    }
                  ></div>
                  <div className="w-72">{reviewer.comments}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Link
              state={{ guestName: userRecord.guestName }}
              className="p-2 bg-[rgb(54,88,153)] rounded-lg text-white mr-16"
              to={"rooms"}
            >
              Assign Rooms
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
