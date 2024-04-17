import React, { useState } from "react";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import FormControl from "@mui/material/FormControl";
import { TextField } from "@mui/material";
import "./Reservation_Form.css";
import { updateFilledPDF } from "../utils/generatePDF";
import InputFileUpload from "../components/uploadFile";
import { useSelector } from "react-redux";
import { privateRequest } from "../utils/useFetch";
import { FileIcon, defaultStyles } from "react-file-icon";
import { Link, useNavigate } from "react-router-dom";
import ApplicantTable from "../components/ApplicantTable";

function ReservationForm() {
  const user = useSelector((state) => state.user);
  const http = privateRequest(user.accessToken, user.refreshToken);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    guestName: "",
    address: "",
    numberOfGuests: "",
    numberOfRooms: "",
    roomType: "Single Occupancy",
    arrivalDate: "",
    arrivalTime: "",
    departureDate: "",
    departureTime: "",
    purpose: "",
    category: "A",
    source: "GUEST",
    applicant: {
      name: "",
      designation: "",
      department: "",
      code: "",
      mobile: "",
      email: "",
    },
  });

  const [errorText, setErrorText] = useState({
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

  const requiredFields = {
    guestName: true,
    address: true,
    numberOfGuests: true,
    numberOfRooms: true,
    roomType: true,
    arrivalDate: true,
    arrivalTime: true,
    departureDate: true,
    departureTime: true,
    purpose: true,
    category: true,
    source: true,
    applicant: true,
  };

  const patterns = {
    guestName: /[a-zA-Z]+/,
    address: /[\s\S]*/,
    numberOfGuests: /[0-9]+/,
    numberOfRooms: /[0-9]+/,
    roomType: /[\s\S]*/,
    arrivalDate: /[\s\S]*/,
    arrivalTime: /[\s\S]*/,
    departureDate: /[\s\S]*/,
    departureTime: /[\s\S]*/,
    purpose: /[\s\S]*/,
    category: /[\s\S]*/,
  };

  const catAReviewers = ["DIRECTOR", "REGISTRAR", "ASSOCIATE DEAN", "DEAN"];

  const catBReviewers = ["HOD", "DEAN", "ASSOCIATE DEAN", "REGISTRAR"];

  const catCReviewers = ["CHAIRMAN"];
  const catDReviewers = ["CHAIRMAN"];
  const [checkedValues, setCheckedValues] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
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

  const handleFileUpload = (files) => {
    setFiles(files);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const receipt = await updateFilledPDF(formData);

    //Handle form validation

    let passed = true;

    for (let [key, value] of Object.entries(formData)) {
      if (key === "files" || key === "receipt") {
        continue;
      }
      if (requiredFields[key] && value === "") {
        setErrorText((prev) => ({
          ...prev,
          [key]: "This field is required",
        }));
        passed = false;
      } else if (patterns[key] && !value.match(patterns[key])) {
        setErrorText((prev) => ({
          ...prev,
          [key]: "Invalid input",
        }));
        passed = false;
      } else {
        setErrorText((prev) => ({
          ...prev,
          [key]: "",
        }));
      }
    }

    const arrivalDateTime = new Date(
      `${formData.arrivalDate}T${formData.arrivalTime}`
    );
    const departureDateTime = new Date(
      `${formData.departureDate}T${formData.departureTime}`
    );

    // Check if no of rooms are Sufficient for Double occupancy
    if (formData.roomType === "Double Occupancy") {
      const numberOfGuests = parseInt(formData.numberOfGuests);
      const numberOfRooms = parseInt(formData.numberOfRooms);
      if (2 * numberOfRooms < numberOfGuests) {
        setErrorText((prev) => ({
          ...prev,
          numberOfRooms:
            "Number of rooms are not sufficient as per number of guests and room type",
        }));
        passed = false;
        toast.error(
          "Number of rooms are not sufficient as per number of guests and room type"
        );
        return;
      }
    }

    // Check if no of rooms are Sufficient for Single occupancy
    if (formData.roomType === "Single Occupancy") {
      const numberOfGuests = parseInt(formData.numberOfGuests);
      const numberOfRooms = parseInt(formData.numberOfRooms);
      if (numberOfRooms < numberOfGuests) {
        setErrorText((prev) => ({
          ...prev,
          numberOfRooms:
            "Number of rooms are not sufficient as per number of guests and room type",
        }));
        passed = false;
        toast.error(
          "Number of rooms are not sufficient as per number of guests and room type"
        );
        return;
      }
    }

    // Check if departure is after arrival
    if (departureDateTime <= arrivalDateTime) {
      passed = false;
      setErrorText((prev) => ({
        ...prev,
        departureDate: "Departure date must be after arrival date",
        departureTime: "Departure time must be after arrival time",
      }));
      toast.error("Departure should be After Arrival");
      return;
    }

    if (formData.arrivalTime < "13:00") {
      toast.error("Arrival time should be after 01:00 PM");
      return;
    }

    if (formData.departureTime > "11:00") {
      toast.error("Departure time should be before 11:00 AM");
      return;
    }

    for (let [key, value] of Object.entries(formData.applicant)) {
      if (value === "") {
        passed = false;
      }
    }

    if (!passed) {
      toast.error("Please Fill All Necessary Fields Correctly.");
      return;
    }

    if (
      (formData.category === "A" || formData.category === "B") &&
      Array.from(files).length === 0
    ) {
      toast.error("Uploading files is mandatory for category A and B");
      return;
    }

    if (checkedValues.length < 0) {
      toast.error("Please add a reviewer/reviewers");
      return;
    }

    // Handle form submission
    setLoading(true);

    console.log("Herefecae")

    const toast_id = toast.loading("Submitting form...");

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([fieldName, fieldValue]) => {
        if (fieldName === "applicant")
          formDataToSend.append(fieldName, JSON.stringify(fieldValue));
        formDataToSend.append(fieldName, fieldValue);
      });
      for (const file of files) {
        formDataToSend.append("files", file);
      }
      formDataToSend.append("reviewers", checkedValues);
      formDataToSend.append("receipt", receipt);
      const res = await http.post("reservation/", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res.status);
      if (res.status === 200) {
        // toast.success("Form submitted successfully!");
        console.log("success1");
        toast.update(toast_id, {
          render: "Form submitted successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        setLoading(false);
        navigate("..");
      } else {
        console.log("fail");

        toast.update(toast_id, {
          render: "Form submission failed.",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error("Form submission failed:", error);
      setLoading(false);

      if (error.response?.data?.message) {
        console.log("fail1");
        toast.update(toast_id, {
          render: error.response.data.message,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      } else {
        console.log("fail2");

        toast.update(toast_id, {
          render: "Form submission failed.",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }
    }
  };

  return (
    <div className="w-full">
      <div className="reservation-container border shadow-xl rounded-lg  bg-white">
        <h2 className="py-2 mb-5">Guest House Reservation Form</h2>
        <FormControl className="w-full flex gap-4">
          <div>
            <TextField
              label="Name of Guest"
              error={errorText.guestName !== ""}
              required={requiredFields.guestName}
              helperText={errorText.guestName && errorText.guestName}
              fullWidth
              variant="outlined"
              name="guestName"
              value={formData.guestName}
              onChange={handleChange}
            />
          </div>

          <div>
            <TextField
              label="Address"
              error={errorText.address !== ""}
              helperText={errorText.address && errorText.address}
              fullWidth
              required={requiredFields.address}
              className="bg-white"
              variant="outlined"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <TextField
            label="Number of Guests"
            fullWidth
            error={errorText.numberOfGuests !== ""}
            required={requiredFields.numberOfGuests}
            helperText={errorText.numberOfGuests && errorText.numberOfGuests}
            className="bg-white"
            variant="outlined"
            name="numberOfGuests"
            value={formData.numberOfGuests}
            onChange={handleChange}
          />
          <TextField
            label="Number of Rooms Required"
            fullWidth
            error={errorText.numberOfRooms !== ""}
            required={requiredFields.numberOfRooms}
            helperText={errorText.numberOfRooms && errorText.numberOfRooms}
            className="bg-white"
            variant="outlined"
            name="numberOfRooms"
            value={formData.numberOfRooms}
            onChange={handleChange}
          />

          <div className="form-group">
            <label>Room Type*</label>

            <select
              name="roomType"
              className="w-full h-12 border rounded-md border-gray-300 p-2 whitespace-pre"
              onChange={handleChange}
              value={formData.roomType}
            >
              <option className="" value="Single Occupancy">
                Single Occupancy
              </option>
              <option className="" value="Double Occupancy">
                Double Occupancy
              </option>
            </select>
          </div>

          <div className="form-group">
            <label>Arrival Date*:</label>
            <input
              type="date"
              name="arrivalDate"
              value={formData.arrivalDate}
              onChange={handleChange}
              min={new Date(Date.now()).toISOString().split("T")[0]}
            />
          </div>

          <div className="form-group">
            <label>Arrival Time*: (Arrival time must be after 01:00 PM)</label>
            <input
              type="time"
              name="arrivalTime"
              value={formData.arrivalTime}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Departure Date*:</label>
            <input
              type="date"
              name="departureDate"
              value={formData.departureDate}
              onChange={handleChange}
              min={new Date(Date.now()).toISOString().split("T")[0]}
            />
          </div>
          <div className="form-group">
            <label>
              Departure Time*: (Departure time must be before 11:00 AM)
            </label>
            <input
              type="time"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleChange}
            />
          </div>

          <TextField
            label="Purpose of Booking"
            error={errorText.purpose !== ""}
            helperText={errorText.purpose && errorText.purpose}
            required={requiredFields.purpose}
            fullWidth
            className=""
            variant="outlined"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
          />

          <div className="form-group">
            <label>
              Category*: (Refer to{" "}
              <a
                className="underline"
                href="/forms/categories.pdf"
                target="_blank"
              >
                this
              </a>{" "}
              page for details of categories and tariff)
            </label>

            <select
              name="category"
              className="w-full h-12 border rounded-md border-gray-300 p-2 mb-5 whitespace-pre"
              onChange={handleChange}
              value={formData.category}
            >
              <option className="" value="A">
                Category A
              </option>
              <option className="" value="B">
                Category B
              </option>
              <option className="" value="C">
                Category C
              </option>
              <option className="" value="D">
                Category D
              </option>
            </select>

            <div className="w-full p-2 mb-5">
              <ul className="flex flex-col justify-center">
                {formData.category === "A" &&
                  catAReviewers.map((reviewer) => (
                    <li
                      key={reviewer}
                      className="flex justify-start gap-4 items-center w-full"
                    >
                      <input
                        name="reviewers"
                        type="checkbox"
                        id={reviewer}
                        value={reviewer}
                        onChange={handleCheckboxChange}
                        style={{ width: "20px" }}
                      />
                      <label className="w-32" htmlFor={reviewer}>
                        {reviewer}
                      </label>
                    </li>
                  ))}
                {formData.category === "B" &&
                  catBReviewers.map((reviewer) => (
                    <li
                      key={reviewer}
                      className="flex justify-start gap-4 items-center w-full"
                    >
                      <input
                        name="reviewers"
                        type="checkbox"
                        id={reviewer}
                        value={reviewer}
                        onChange={handleCheckboxChange}
                        style={{ width: "20px" }}
                      />
                      <label className="w-32" htmlFor={reviewer}>
                        {reviewer}
                      </label>
                    </li>
                  ))}
                {formData.category === "C" &&
                  catCReviewers.map((reviewer) => (
                    <li
                      key={reviewer}
                      className="flex justify-start gap-4 items-center w-full"
                    >
                      <input
                        name="reviewers"
                        type="checkbox"
                        id={reviewer}
                        value={reviewer}
                        onChange={handleCheckboxChange}
                        style={{ width: "20px" }}
                      />
                      <label className="w-32" htmlFor={reviewer}>
                        {reviewer}
                      </label>
                    </li>
                  ))}
                {formData.category === "D" &&
                  catDReviewers.map((reviewer) => (
                    <li
                      key={reviewer}
                      className="flex justify-start gap-4 items-center w-full"
                    >
                      <input
                        name="reviewers"
                        type="checkbox"
                        id={reviewer}
                        value={reviewer}
                        onChange={handleCheckboxChange}
                        style={{ width: "20px" }}
                      />
                      <label className="w-32" htmlFor={reviewer}>
                        {reviewer}
                      </label>
                    </li>
                  ))}
              </ul>
            </div>
            {(formData.category === "B" || formData.category === "C") && (
              <>
                <label>Payment*:</label>

                <select
                  name="source"
                  className="w-full h-12 border rounded-md border-gray-300 p-2 mb-5 whitespace-pre"
                  onChange={handleChange}
                  value={formData.paymentType}
                >
                  <option value="GUEST">Paid by guest</option>
                  <option value="DEPARTMENT">Paid by department</option>
                  {formData.category === "B" && (
                    <option value="OTHERS">Paid by other sources</option>
                  )}
                </select>
              </>
            )}

            <div className="flex gap-10">
              <div>
                <InputFileUpload className="" onFileUpload={handleFileUpload} />
              </div>
              {Array.from(files).length > 0 ? (
                <div className="flex flex-col  overflow-y-auto max-w-[30rem] h-16 gap-2 pr-2">
                  {Array.from(files).map((file, index) => {
                    const arr = file.name.split(".");
                    const ext = arr[arr.length - 1];
                    return (
                      <div className="flex gap-4 items-center">
                        <div className="w-7">
                          <FileIcon
                            className=""
                            extension={ext}
                            {...defaultStyles}
                          />
                        </div>
                        <div
                          onClick={() => {
                            window.open(window.URL.createObjectURL(file));
                          }}
                          className="text-sm text-gray-500 hover:text-blue-500 cursor-pointer"
                        >
                          {file.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                (formData.category === "A" || formData.category === "B") && (
                  <div className="flex items-center text-gray-500">
                    *Uploading files is mandatory for category A and B
                  </div>
                )
              )}
            </div>
            <div className="mt-5 flex flex-col gap-2">
              <div>Applicant Details:</div>
              <div>
                <ApplicantTable
                  entry={formData.applicant}
                  setEntry={(entry) =>
                    setFormData((prev) => ({ ...prev, applicant: entry }))
                  }
                />
              </div>
            </div>
          </div>

          <div>
            By clicking on Submit, you hereby agree to the{" "}
            <a
              href="/forms/TermsAndConditions.pdf"
              className="underline"
              target="_blank"
            >
              Terms and Conditions
            </a>
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="submit-btn"
          >
            Submit
          </button>
          <button
            onClick={async () => {
              const blob = await updateFilledPDF(formData);
              const pdfUrl = URL.createObjectURL(blob);
              window.open(pdfUrl);
            }}
            className="convert-to-pdf-btn"
          >
            See Preview - PDF
          </button>
        </FormControl>
      </div>
    </div>
  );
}

export default ReservationForm;
