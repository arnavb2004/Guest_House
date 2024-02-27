import React, { useState, useEffect } from "react";
import { saveAs } from 'file-saver';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit'
import Header from "../components/Header";
import axios from "axios";
import styles from './Reservation_Form.module.css';

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
    payment: "",
    indenterName: "",
    indenterDesignation: "",
    indenterDepartment: "",
    indenterEmployeeCode: "",
    indenterMobileNumber: "",
    hodName: "",
    hodDesignation: "",
    approvingAuthorityName: "",
    approvingAuthorityDesignation: "",
    recommendation: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    axios.post('http://localhost:4751/reservation',formData);
    console.log("Form submitted");
  };

  const generateFilledPDF = async () => {
    try {
      // Assuming this URL and fetch operation work correctly
      const fontUrl = 'https://pdf-lib.js.org/assets/ubuntu/Ubuntu-R.ttf';
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
      firstPage.drawText(formData.guestName, { x: 165, y: 715, size: 12, font: ubuntuFont, color: rgb(0, 0, 0) });
      firstPage.drawText(formData.address, { x: 120, y: 690, size: 12, font: ubuntuFont, color: rgb(0, 0, 0) });
      firstPage.drawText(formData.numberOfGuests, { x: 165, y: 670, size: 12, font: ubuntuFont, color: rgb(0, 0, 0) });
      firstPage.drawText(formData.numberOfRooms, { x: 460, y: 670, size: 12, font: ubuntuFont, color: rgb(0, 0, 0) });
      firstPage.drawText(formData.roomType, { x: 350, y: 650, size: 12, font: ubuntuFont, color: rgb(0, 0, 0) });
      firstPage.drawText(formData.arrivalDate, { x: 90, y: 605, size: 12, font: ubuntuFont, color: rgb(0, 0, 0) });
      firstPage.drawText(formData.arrivalTime, { x: 210, y: 605, size: 12, font: ubuntuFont, color: rgb(0, 0, 0) });
      firstPage.drawText(formData.departureDate, { x: 330, y: 605, size: 12, font: ubuntuFont, color: rgb(0, 0, 0) });
      firstPage.drawText(formData.departureTime, { x: 460, y: 605, size: 12, font: ubuntuFont, color: rgb(0, 0, 0) });
      // Add the rest of your form fields here in a similar manner.
      
      // Ensure the field names match exactly what's in your PDF
      // form.getTextField("pdfjs_internal_id_342R").setText("hohoho");
      // form.getTextField("pdfjs_internal_id_342R").setText("hohoho");
      // form.getTextField('address').setText("h");
      // form.updateFieldAppearances(ubuntuFont); // Update appearances with the embedded font
  
      const filledPdfBytes = await pdfDoc.save();
      return filledPdfBytes;
    } catch (error) {
      console.error('Error generating filled PDF:', error);
      throw error; // Ensure error handling is in place
    }
  };
  
  const updateFilledPDF = async () => {
    try {

      // Load existing PDF bytes
      const filledPdfBytes = await generateFilledPDF();
      const blob = new Blob([filledPdfBytes], { type: 'application/pdf' });
      console.log(blob)
      const pdfUrl = URL.createObjectURL(blob);
      window.open(pdfUrl);
      // saveAs(blob, 'filled_form.pdf');

    } catch (error) {
      console.error('Error updating filled PDF:', error);
    }
  };

  return (
    <>
    <Header/>
    <div className={styles.reservation_container}>
      <h2>Guest House Reservation Form</h2>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <div className={styles.form_group}>
          <label>Name of the Guest:</label>
          <input
            type="text"
            name="guestName"
            value={formData.guestName}
            onChange={handleChange}
          />
        </div>
        <div className={styles.form_group}>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div className={styles.form_group}>
          <label>Number of guests:</label>
          <input
            type="text"
            name="numberOfGuests"
            value={formData.numberOfGuests}
            onChange={handleChange}
          />
        </div>
        <div className={styles.form_group}>
          <label>Number of Rooms required:</label>
          <input
            type="text"
            name="numberOfRooms"
            value={formData.numberOfRooms}
            onChange={handleChange}
          />
        </div>
        <div className={styles.form_group}>
          <label>Room Type (Single Occupancy/Double Occupancy):</label>
          <input
            type="text"
            name="roomType"
            value={formData.roomType}
            onChange={handleChange}
          />
        </div>
        <div className={styles.form_group}>
          <label>Arrival Date:</label>
          <input
            type="date"
            name="arrivalDate"
            value={formData.arrivalDate}
            onChange={handleChange}
          />
        </div>
        <div className={styles.form_group}>
          <label>Arrival Time:</label>
          <input
            type="time"
            name="arrivalTime"
            value={formData.arrivalTime}
            onChange={handleChange}
          />
        </div>
        <div className={styles.form_group}>
          <label>Departure Date:</label>
          <input
            type="date"
            name="departureDate"
            value={formData.departureDate}
            onChange={handleChange}
          />
        </div>
        <div className={styles.form_group}>
          <label>Departure Time:</label>
          <input
            type="time"
            name="departureTime"
            value={formData.departureTime}
            onChange={handleChange}
          />
        </div>
        <div className={styles.form_group}>
          <label>Purpose of Booking:</label>
          <input
            type="text"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
          />
        </div>
        <div className={styles.form_group}>
          <label>Category (Cat-A, Cat-B, Cat-C):</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
        </div>
        <div className={styles.form_group}>
          <label>Payment:</label>
          <input
            type="text"
            name="payment"
            value={formData.payment}
            onChange={handleChange}
          />
        </div>
        <div className={styles.form_group}>
          <label>Indenter/Proposer Name:</label>
          <input
            type="text"
            name="indenterName"
            value={formData.indenterName}
            onChange={handleChange}
          />
        </div>
        <div className={styles.form_group}>
          <label>Indenter/Proposer Designation:</label>
          <input
            type="text"
            name="indenterDesignation"
            value={formData.indenterDesignation}
            onChange={handleChange}
          />
        </div>
        <div className={styles.form_group}>
          <label>Indenter/Proposer Department:</label>
          <input
            type="text"
            name="indenterDepartment"
            value={formData.indenterDepartment}
            onChange={handleChange}
          />
        </div>
        <div className={styles.form_group}>
          <label>Indenter/Proposer Employee Code/Entry Number:</label>
          <input
            type="text"
            name="indenterEmployeeCode"
            value={formData.indenterEmployeeCode}
            onChange={handleChange}
          />
        </div>
        <div className={styles.form_group}>
          <label>Indenter/Proposer Mobile Number:</label>
          <input
            type="text"
            name="indenterMobileNumber"
            value={formData.indenterMobileNumber}
            onChange={handleChange}
          />
        </div>
        <div className={styles.form_group}>
          <label>HoD/Section Head Name:</label>
          <input
            type="text"
            name="hodName"
            value={formData.hodName}
            onChange={handleChange}
          />
        </div>
        <div className={styles.form_group}>
          <label>HoD/Section Head Designation:</label>
          <input
            type="text"
            name="hodDesignation"
            value={formData.hodDesignation}
            onChange={handleChange}
          />
        </div>
        <div className={styles.form_group}>
          <label>Approving Authority Name:</label>
          <input
            type="text"
            name="approvingAuthorityName"
            value={formData.approvingAuthorityName}
            onChange={handleChange}
          />
        </div>
        <div className={styles.form_group}>
          <label>Approving Authority Designation:</label>
          <input
            type="text"
            name="approvingAuthorityDesignation"
            value={formData.approvingAuthorityDesignation}
            onChange={handleChange}
          />
        </div>
        <div className={styles.form_group}>
          <label>Recommendation:</label>
          <input
            type="text"
            name="recommendation"
            value={formData.recommendation}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className={styles.submit_btn}>
          Submit
        </button>
      </form>
        <button onClick={updateFilledPDF} className={styles.convert_to_pdf_btn}>See Preview - PDF</button>
      </div>
      
      </>
  );
}

export default ReservationForm;
