import React from "react";
import { useSelector } from "react-redux";
import { privateRequest } from "../utils/useFetch";
import StepperComponent from "./Stepper";
import { toast } from "react-toastify";

const Workflow = ({ id, userRecord, reviewers, setReviewers }) => {
  const steps = ["Reservation Form", "Approval", "Room allocation", "Payment"];

  console.log(userRecord);

  const { stepsCompleted } = userRecord;
  const user = useSelector((state) => state.user);
  const makeRequest = privateRequest(user.accessToken, user.refreshToken);
  const reviewer = reviewers.find((reviewer) => reviewer.role === user.role);
  const comments = reviewer?.comments;
  // const stepsCompleted = 2;
  return (
    <div className=" flex flex-col bg-[rgba(255,255,255,0.5)] rounded-lg items-center overflow-x-auto justify-center col-span-3 shadow-lg p-8 gap-10">
      <StepperComponent steps={steps} stepsCompleted={stepsCompleted || 0} />
      <div className="w-full mt-10 flex gap-3 lg:flex-col justify-around pr-3">
        {user.role !== "USER" && (
          <>
            <button
              onClick={async () => {
                try {
                  await makeRequest.put("/reservation/approve/" + id, {
                    comments,
                  });
                  toast.success("Reservation Approved");
                  window.location.reload();
                } catch (error) {
                  if (error.response?.data?.message) {
                    toast.error(error.response.data);
                  } else {
                    toast.error("An error occurred");
                  }
                }
              }}
              className="border rounded-lg p-3 px-4 bg-green-400 hover:bg-green-500"
            >
              Approve
            </button>
            <button
              onClick={async () => {
                try {
                  await makeRequest.put("/reservation/reject/" + id, {
                    comments,
                  });
                  toast.success("Reservation Rejected");
                  window.location.reload();
                } catch (error) {
                  if (error.response?.data?.message) {
                    toast.error(error.response.data);
                  } else {
                    toast.error("An error occurred");
                  }
                }
              }}
              className="border rounded-lg p-3 px-4 bg-red-400 hover:bg-red-500"
            >
              Reject
            </button>
            <button
              onClick={async () => {
                try {
                  await makeRequest.put("/reservation/hold/" + id, {
                    comments,
                  });
                  toast.success("Reservation put on hold");
                  window.location.reload();
                } catch (error) {
                  if (error.response?.data?.message) {
                    toast.error(error.response.data);
                  } else {
                    toast.error("An error occurred");
                  }
                }
              }}
              className="border rounded-lg p-3 px-4 bg-yellow-400 hover:bg-yellow-500"
            >
              Review
            </button>
          </>
        )}
      </div>
      <div className="w-full">
        {user.role !== "USER" && (
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
