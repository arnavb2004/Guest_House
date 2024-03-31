import React, { useRef, useState, useEffect } from "react";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import FormControl from "@mui/material/FormControl";
import { TextField } from "@mui/material";
import "./Reservation_Form.css";
import { updateFilledPDF } from "../utils/generatePDF";
import { FileUpload } from "primereact/fileupload";
import { Toast } from "primereact/toast";
import InputFileUpload from "../components/uploadFile";
import { useSelector } from "react-redux";
import { privateRequest } from "../utils/useFetch";
import { FileIcon, defaultStyles } from "react-file-icon";
import { Link } from "react-router-dom";

function AutoDemo() {
  const toast_temp = useRef(null);

  const onUpload = () => {
    toast_temp.current.show({
      severity: "info",
      summary: "Success",
      detail: "File Uploaded",
    });
  };

  return (
    <div className="card flex justify-content-center">
      <Toast ref={toast_temp}></Toast>
      <FileUpload
        mode="basic"
        name="demo[]"
        url="/api/upload"
        accept="image/*"
        maxFileSize={1000000}
        onUpload={onUpload}
        auto
        chooseLabel="Browse"
      />
    </div>
  );
}

function ReservationForm() {
  const user = useSelector((state) => state.user);
  const makeRequest = privateRequest(user.accessToken, user.refreshToken);

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

  console.log(loading);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleFileUpload = (files) => {
    console.log(files);
    setFiles(files);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const receipt = await updateFilledPDF(formData);

    console.log(receipt);
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
      } else if (!value.match(patterns[key])) {
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
    console.log(errorText);

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

    console.log("passed");


    // Handle form submission
    setLoading(true);

    const toast_id = toast.loading("Submitting form...");

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([fieldName, fieldValue]) => {
        formDataToSend.append(fieldName, fieldValue);
      });
      // console.log(files.files)
      for (const file of files) {
        formDataToSend.append("files", file);
      }
      console.log(receipt);
      formDataToSend.append("receipt", receipt);
      await makeRequest.post(
        "http://localhost:4751/reservation/",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // toast.success("Form submitted successfully!");
      toast.update(toast_id, {
        render: "Form submitted successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      setLoading(false);
    } catch (error) {
      console.error("Form submission failed:", error);
      setLoading(false);
      if (error.response?.data?.message) {
        toast.update(toast_id, {
          render: error.response.data.message,
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
      } else {
        toast.update(toast_id, {
          render: "Form submission failed.",
          type: "success",
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
            <label>Room Type</label>

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
            <label>Arrival Date:</label>
            <input
              type="date"
              name="arrivalDate"
              value={formData.arrivalDate}
              onChange={handleChange}
              min={new Date(Date.now()).toISOString().split("T")[0]}
            />
          </div>

          <div className="form-group">
            <label>Arrival Time: (Arrival time must be after 01:00 PM)</label>
            <input
              type="time"
              name="arrivalTime"
              value={formData.arrivalTime}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Departure Date:</label>
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
              Departure Time: (Departure time must be before 11:00 AM)
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
              Category: (Refer to{" "}
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
            <div className="flex gap-10">
              <div>
                <InputFileUpload className="" onFileUpload={handleFileUpload} />
              </div>
              {Array.from(files).length > 0 ? (
                <div className="flex flex-col  overflow-y-auto max-w-[30rem] h-16 gap-2 pr-2">
                  {Array.from(files).map((file, index) => {
                    console.log(index, file);
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
