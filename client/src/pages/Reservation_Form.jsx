import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import axios from "axios";
// import styles from "./Reservation_Form.module.css";
import FormControl from "@mui/material/FormControl";
import { TextField } from "@mui/material";
// import ReservationForm from './Reservation_Form';
import "./Reservation_Form.css";
import { updateFilledPDF } from "../utils/generatePDF";
import { FileUpload } from "primereact/fileupload";
import { Toast } from "primereact/toast";
import InputFileUpload from "../components/uploadFile";
import { useSelector } from "react-redux";
import { privateRequest } from "../utils/useFetch";

function AutoDemo() {
  const toast = useRef(null);

  const onUpload = () => {
    toast.current.show({
      severity: "info",
      summary: "Success",
      detail: "File Uploaded",
    });
  };

  return (
    <div className="card flex justify-content-center">
      <Toast ref={toast}></Toast>
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

  console.log(formData)

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

  console.log(formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Handle form validation

    let passed = true;

    for (let [key, value] of Object.entries(formData)) {
      console.log(key, value);
      // console.log(key, value);
      if (requiredFields[key] && value === "") {
        console.log("here");


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

    const arrivalDateTime = new Date(`${formData.arrivalDate.split('-').reverse().join('-')}T${formData.arrivalTime}`);
    const departureDateTime = new Date(`${formData.departureDate.split('-').reverse().join('-')}T${formData.departureTime}`);
    
    console.log(departureDateTime)
    console.log(arrivalDateTime)
    
    // Check if departure is after arrival
    if (departureDateTime <= arrivalDateTime) {
      passed = false;
      setErrorText((prev) => ({
        ...prev,
        departureDate: "Departure date must be after arrival date",
        departureTime: "Departure time must be after arrival time",
      }));
    }

    if (!passed) return;

    console.log("passed");

    // Handle form submission
    // axios.post("http://localhost:4751/reservation", formData);

    try {
      await makeRequest.post(
        "http://localhost:4751/reservation/create",
        formData
      );
      console.log("Form submitted");
      toast.success("Form submitted successfully!");
    } catch (error) {
      console.error("Form submission failed:", error);
      // Show error toast notification
      toast.error("Form submission failed. Please try again later.");
    }
    
  };

  return (
    <div className="w-full">
      {/* <Header /> */}
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
            {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
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
            />
          </div>

          <div className="form-group">
            <label>Arrival Time:</label>
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
            />
          </div>
          <div className="form-group">
            <label>Departure Time:</label>
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
            <label>Category: (Refer to this page for categories)</label>

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
            {/* <AutoDemo/> */}
            <InputFileUpload className="" />

            {/* <div className="card">
              <FileUpload
                name="demo[]"
                url={"/api/upload"}
                multiple
                accept="image/*"
                maxFileSize={1000000}
                emptyTemplate={
                  <p className="m-0">Drag and drop files to here to upload.</p>
                }
              />
            </div> */}
          </div>
          <button type="submit" onClick={handleSubmit} className="submit-btn">
            Submit
          </button>
          <button
            onClick={() => {
              updateFilledPDF(formData);
            }}
            className="convert-to-pdf-btn"
          >
            See Preview - PDF
          </button>
        </FormControl>
        {/* <button onClick={updateFilledPDF} className="convert-to-pdf-btn">Convert to PDF</button> */}
      </div>
    </div>
  );
}

export default ReservationForm;
