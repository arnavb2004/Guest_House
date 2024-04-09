import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import DiningWorkflow from "../components/DiningWorkflow";
import Workflow from "../components/Workflow";
import { privateRequest } from "../utils/useFetch";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { Link } from "react-router-dom";

export default function DiningRecordPage() {
  const { id } = useParams();

  const user = useSelector((state) => state.user);
  const color = {
    PENDING: "bg-gray-400",
    APPROVED: "bg-green-400",
    REJECTED: "bg-red-400",
    HOLD: "bg-yellow-400",
  };

  const makeRequest = privateRequest(user.accessToken, user.refreshToken);
  const [status, setStatus] = useState("Loading");

  const [reviewers, setReviewers] = useState([]);
  const [checkedValues, setCheckedValues] = useState([]);

  const [userRecord, setUserRecord] = useState({
    email: "",
    items: [],
    amount: "",
  });

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
        const response = await makeRequest.get(`/dining/${id}`);
        setStatus("Success");
        console.log(response.data);
        setUserRecord(response.data.order);
        setReviewers(response.data.order.reviewers);
        setCheckedValues(
          response.data.order.reviewers.map((reviewer) => reviewer.role) || []
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
        <DiningWorkflow
          id={id}
          userRecord={userRecord}
          setUserRecord={setUserRecord}
          reviewers={reviewers}
          setReviewers={setReviewers}
        />

        <div className='col-span-5 shadow-lg flex flex-col gap-4 font-["Dosis"] bg-[rgba(255,255,255,0.5)] rounded-lg pt-4'>
          <div className="flex justify-between px-32  ">
            <p className="p-2 text-xl font-semibold">Guest Email:</p>
            <p className="p-2 text-lg">{userRecord.email}</p>
          </div>
          <hr className="bg-black" />
          <div className="flex justify-between px-32">
            <p className="p-2 text-xl w-32 font-semibold">Name</p>
            <p className="p-2 text-lg w-32 font-semibold">Quantity</p>
            <p className="p-2 text-lg font-semibold">Price</p>
          </div>
          {userRecord.items.map((item, index) => (
            <div key={index} className="flex justify-between px-32">
              <p className="p-2 w-32 text-lg` font-semibold">{item.name}</p>
              <p className="p-2 w-32 pl-8 text-md">{item.quantity}</p>
              <p className="p-2 text-md pr-5">{item.price}</p>
            </div>
          ))}
          <div className="flex px-32">
            <p className="p-2 text-xl font-semibold">Amount: </p>
            <p className="p-2 text-xl">{userRecord.amount}</p>
          </div>
        </div>
      </div>
      <div className='col-span-5 shadow-lg flex p-5 gap-24 m-9 font-["Dosis"] bg-[rgba(255,255,255,0.5)] rounded-lg'>
        {user.role === "ADMIN" && (
          <div>
            <div className="text-2xl font-semibold font-['Dosis'] px-5">
              Reviewers
            </div>
            <div className="p-5">
              <ul>
                {roles.map((role) => (
                  <li>
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
                  try {
                    const res = makeRequest.put(`/dining/${id}/assign`, {
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
        )}

        {user.role !== "ADMIN" && (
          <div>
            <div className="text-2xl font-semibold font-['Dosis'] px-5 ">
              Status
            </div>
            <div className="p-5 flex flex-col gap-4 ">
              {reviewers.map((reviewer) => {
                console.log(reviewer.status);
                return (
                  <div className="flex gap-4 w-max">
                    <div className="w-20">{reviewer.role}</div>
                    <div
                      className={
                        "border relative top-1 w-5 h-5 " +
                        color[reviewer.status || "PENDING"]
                      }
                    ></div>
                    <div className="w-72">{reviewer.comments}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
