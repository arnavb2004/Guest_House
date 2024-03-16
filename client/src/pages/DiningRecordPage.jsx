import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation, useParams } from "react-router-dom";
import axios from "axios"; // Assuming you use axios for API requests
import Workflow from "../components/Workflow";
import { privateRequest } from "../utils/useFetch";
import NotFound from "./NotFound";

export default function DiningRecordPage() {
  const { id } = useParams();

  const user = useSelector((state) => state.user);


  const makeRequest = privateRequest(user.accessToken, user.refreshToken);
  const [status, setStatus] = useState("Loading");


  const [userRecord, setUserRecord] = useState({
    email: "",
    items: [],
    amount: "",
  });

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await makeRequest.get(`/dining/${id}`);
        console.log(response.data);
        setStatus("Success");
        setUserRecord(response.data.order);
      } catch (error) {
        setStatus("Error");
        console.error("Error fetching user data:", error);
      }
    };

    fetchRecord();
  }, [id]);

  console.log(id);
  console.log(userRecord);

  if (status === "Error") return <Navigate to="/error" />;


  return (
    <div className="grid grid-cols-8 m-9 gap-4">
      <Workflow id={id} userRecord={userRecord} setUserRecord={setUserRecord} />

      <div className='col-span-5 shadow-lg flex flex-col gap-4 font-["Dosis"]'>
        <div className="flex justify-between px-32  ">
          <p className="p-2 text-xl font-semibold">Guest Email:</p>
          <p className="p-2 text-lg">{userRecord.email}</p>
        </div>
        <hr className="bg-black" />
        <div className="flex justify-between px-32">
          <p className="p-2 text-xl font-semibold">Name</p>
          <p className="p-2 text-lg font-semibold">Quantity</p>
          <p className="p-2 text-lg font-semibold">Price</p>
        </div>
        {userRecord.items.map((item, index) => (
          <div key={index} className="flex justify-between px-32">
            <p className="p-2 text-lg` font-semibold">{item.name}</p>
            <p className="p-2 text-md">{item.quantity}</p>
            <p className="p-2 text-md">{item.price}</p>
          </div>
        ))}
        <div className="flex px-32">
          <p className="p-2 text-xl font-semibold">Amount: </p>
          <p className="p-2 text-xl">{userRecord.amount}</p>
        </div>
      </div>
    </div>
  );
}
