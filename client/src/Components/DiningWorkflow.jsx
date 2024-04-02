import React from "react";
import { useSelector } from "react-redux";
import { privateRequest } from "../utils/useFetch";
import StepperComponent from "./Stepper";

const DiningWorkflow = ({ id, userRecord }) => {
  const steps = [
    "Place Order",
    "Approval",
    "Payment"
  ];

  const { stepsCompleted } = userRecord;
  const user = useSelector((state) => state.user);
  const makeRequest = privateRequest(user.accessToken, user.refreshToken);
  const comments = userRecord.comments || "";

  return (
    <div className=" flex flex-col justify-center col-span-3 shadow-lg p-8 gap-10">
      <StepperComponent steps={steps} stepsCompleted={stepsCompleted || 0} />
      <div className="w-full mt-10 flex justify-around">
        {user.role !== "USER" && (
          <>
            <button
              onClick={() => {
                makeRequest.put("/reservation/approve/" + id, { comments });
              }}
              className="border rounded-lg p-3 px-4 bg-green-400 hover:bg-green-500"
            >
              Approve
            </button>
            <button
              onClick={() => {
                makeRequest.put("/reservation/reject/" + id, { comments });
              }}
              className="border rounded-lg p-3 px-4 bg-red-400 hover:bg-red-500"
            >
              Reject
            </button>
            <button
              onClick={() => {
                makeRequest.put("/reservation/hold/" + id, { comments });
              }}
              className="border rounded-lg p-3 px-4 bg-yellow-400 hover:bg-yellow-500"
            >
              Review
            </button>
          </>
        )}
      </div>
      <div className="w-full">
        {user.role === "USER" ? (
          comments && (
            <div className="border shadow-lg rounded-lg">
              <div className="p-2">Comments</div>
              <hr className="" />
              <div className="font-['Dosis'] p-2">{comments}</div>
            </div>
          )
        ) : (
          <textarea
            className="w-full p-2 bg-white border-gray-500 rounded-lg"
            rows={5}
            value={comments || ""}
            onChange={(e) => {}}
            placeholder={"Write any review or comments"}
          ></textarea>
        )}
      </div>
    </div>
  );
};

export default DiningWorkflow;
