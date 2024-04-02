import React from "react";
import { useSelector } from "react-redux";
import { privateRequest } from "../utils/useFetch";
import StepperComponent from "./Stepper";

const Workflow = ({ id, userRecord, reviewers, setReviewers }) => {
  
  const steps = [
    "Reservation Form",
    "Approval",
    "Room allocation",
    "Payment",
  ];

  console.log(userRecord)

  const { stepsCompleted } = userRecord;
  const user = useSelector((state) => state.user);
  const makeRequest = privateRequest(user.accessToken, user.refreshToken);
  const reviewer = reviewers.find((reviewer) => reviewer.role === user.role);
  const comments = reviewer?.comments;
  // const stepsCompleted = 2;
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
            // disabled={user.role !== "ADMIN"}
            className="w-full p-2 bg-white border-gray-500 rounded-lg"
            rows={5}
            value={comments || ""}
            onChange={(e) =>
              setReviewers((prev) =>
                prev.map((r) =>
                  r.role === user.role ? { ...r, comments: e.target.value } : r
                )
              )
            }
            placeholder={"Write any review or comments"}
          ></textarea>
        )}
      </div>
    </div>
  );
};

export default Workflow;
