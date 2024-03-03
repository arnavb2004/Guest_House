import React, { useState, useEffect } from "react";

import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import Header from "../components/Header";
import axios from "axios";
// import styles from "./Reservation_Form.module.css";
import FormControl from "@mui/material/FormControl";
import { TextField } from "@mui/material";
// import ReservationForm from './Reservation_Form';
import "./Reservation_Form.css";

function ReservationForm() {
  const [formData, setFormData] = useState({
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
    numberOfRooms: false,
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

  const handleSubmit = (e) => {
    e.preventDefault();


    //Handle form validation

    let passed = true;

    for (let [key, value] of Object.entries(formData)) {
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

    if (!passed) return;

    // Handle form submission
    axios.post("http://localhost:4751/reservation", formData);
    console.log("Form submitted");
  };

  const generateFilledPDF = async () => {
    try {
      // Assuming this URL and fetch operation work correctly
      const fontUrl = "https://pdf-lib.js.org/assets/ubuntu/Ubuntu-R.ttf";
      const fontBytes = await fetch(fontUrl).then((res) => res.arrayBuffer());

      // Fetch the PDF from a URL or local assets (adjust the URL as needed)
      const pdfUrl = `${process.env.PUBLIC_URL}/forms/Register_Form.pdf`;
      const pdfData = await fetch(pdfUrl).then((res) => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfData);

      pdfDoc.registerFontkit(fontkit);
      const ubuntuFont = await pdfDoc.embedFont(fontBytes);

      const form = pdfDoc.getForm();
      const pages = pdfDoc.getPages();
      const firstPage = pages[0]; // Assuming all fields are on the first page

      // Example for a few fields, you'll need to add the rest following this pattern
      firstPage.drawText(formData.guestName, {
        x: 165,
        y: 711,
        size: 12,
        font: ubuntuFont,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(formData.address, {
        x: 120,
        y: 690,
        size: 12,
        font: ubuntuFont,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(formData.numberOfGuests, {
        x: 165,
        y: 670,
        size: 12,
        font: ubuntuFont,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(formData.numberOfRooms, {
        x: 460,
        y: 670,
        size: 12,
        font: ubuntuFont,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(formData.roomType, {
        x: 350,
        y: 650,
        size: 12,
        font: ubuntuFont,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(formData.arrivalDate, {
        x: 90,
        y: 605,
        size: 12,
        font: ubuntuFont,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(formData.arrivalTime, {
        x: 210,
        y: 605,
        size: 12,
        font: ubuntuFont,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(formData.departureDate, {
        x: 330,
        y: 602,
        size: 12,
        font: ubuntuFont,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(formData.departureTime, {
        x: 460,
        y: 607,
        size: 12,
        font: ubuntuFont,
        color: rgb(0, 0, 0),
      });
      // Add the rest of your form fields here in a similar manner.

      // Ensure the field names match exactly what's in your PDF
      // form.getTextField("pdfjs_internal_id_342R").setText("hohoho");
      // form.getTextField("pdfjs_internal_id_342R").setText("hohoho");
      // form.getTextField('address').setText("h");
      // form.updateFieldAppearances(ubuntuFont); // Update appearances with the embedded font

      const filledPdfBytes = await pdfDoc.save();
      return filledPdfBytes;
    } catch (error) {
      console.error("Error generating filled PDF:", error);
      throw error; // Ensure error handling is in place
    }
  };

  const updateFilledPDF = async () => {
    console.log("herer");
    try {
      // Load existing PDF bytes
      const filledPdfBytes = await generateFilledPDF();
      const blob = new Blob([filledPdfBytes], { type: "application/pdf" });
      console.log(blob);
      const pdfUrl = URL.createObjectURL(blob);
      window.open(pdfUrl);
      // saveAs(blob, 'filled_form.pdf');
    } catch (error) {
      console.error("Error updating filled PDF:", error);
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
              error={errorText.guestName}
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
              error={errorText.address}
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
            error={errorText.numberOfGuests}
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
            error={errorText.numberOfRooms}
            required={requiredFields.numberOfRooms}
            helperText={errorText.numberOfRooms && errorText.numberOfRooms}
            className="bg-white"
            variant="outlined"
            name="numberOfRooms"
            value={formData.numberOfRooms}
            onChange={handleChange}
          />

          
<div className="form-group">
            <label>Category: (Refer to this page for categories)</label>

            <select
              name="roomType"
              className="w-full h-12 border rounded-md border-gray-300 p-2 whitespace-pre"
              onChange={handleChange}
              value={formData.roomType}
            >
              <option className="" value="Single Occupancy">
                <div className="w-32 text-wrap">Single Occupancy</div>
              </option>
              <option className="" value="Double Occupancy">
              Double Occupancy
              </option>
            </select>
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
            error={errorText.purpose}
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
              className="w-full h-12 border rounded-md border-gray-300 p-2 whitespace-pre"
              onChange={handleChange}
              value={formData.category}
            >
              <option className="" value="A">
                <div className="w-32 text-wrap">Category A</div>
              </option>
              <option className="" value="B">
                Category B
              </option>
              <option className="" value="C">
                Category C
              </option>
            </select>
          </div>
          <button type="submit" onClick={handleSubmit} className="submit-btn">
            Submit
          </button>
          <button onClick={updateFilledPDF} className="convert-to-pdf-btn">
            See Preview - PDF
          </button>
        </FormControl>
        {/* <button onClick={updateFilledPDF} className="convert-to-pdf-btn">Convert to PDF</button> */}
      </div>
    </div>
  );
}

export default ReservationForm;
