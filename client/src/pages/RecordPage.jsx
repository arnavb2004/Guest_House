import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios"; // Assuming you use axios for API requests
import Workflow from "../components/Workflow";
import { privateRequest } from "../utils/useFetch";

export default function RecordPage() {
  const { id } = useParams();

  const user = useSelector((state) => state.user);

  const makeRequest = privateRequest(user.accessToken, user.refreshToken);

  const [status, setStatus] = useState("Loading");

  const [userRecord, setUserRecord] = useState({
    guestName: "",
    address: "",
    numberOfGuests: "",
    numberOfRooms: "",
    roomType: "",
    arrivalDate: "",
    arrivalTime: "",
    departureDate: "",
    departureTime: "",
    purpose: "",
    category: "",
  });

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await makeRequest.get(`/reservation/${id}`);
        console.log(response.data);
        setStatus("Success");
        setUserRecord(response.data.reservation);
      } catch (error) {
        setStatus("Error");
        console.error("Error fetching user data:", error);
      }
    };

    fetchRecord();
  }, [id]);

  if (status === "Error") return <Navigate to="/error" />;
  else if (status === "Loading") return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-8 m-9 gap-4">
      <Workflow id={id} userRecord={userRecord} setUserRecord={setUserRecord} />

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
          <p className="p-2 text-lg">{userRecord.arrivalDate}</p>
        </div>
        <hr />
        <div className="flex justify-between px-32">
          <p className="p-2 text-xl font-semibold">Arrival Time:</p>
          <p className="p-2 text-lg">{userRecord.arrivalTime}</p>
        </div>
        <hr />
        <div className="flex justify-between px-32">
          <p className="p-2 text-xl font-semibold">Departure Date:</p>
          <p className="p-2 text-lg">{userRecord.departureDate}</p>
        </div>
        <hr />
        <div className="flex justify-between px-32">
          <p className="p-2 text-xl font-semibold">Departure Time:</p>
          <p className="p-2 text-lg">{userRecord.departureTime}</p>
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
  );
}
