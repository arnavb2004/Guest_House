import React from "react";
import Header2 from "../components/Header2";
import Menu from "../components/Menu";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { TextField } from "@mui/material";
import ReservationForm from "./Reservation_Form";
import RecordList from "../components/RecordList";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

function Reservation() {
  // const generateFilledPDF = async () => {
  //   try {
  //     // Assuming this URL and fetch operation work correctly
  //     const fontUrl = 'https://pdf-lib.js.org/assets/ubuntu/Ubuntu-R.ttf';
  //     const fontBytes = await fetch(fontUrl).then((res) => res.arrayBuffer());

  //     // Fetch the PDF from a URL or local assets (adjust the URL as needed)
  //     const pdfUrl = ${process.env.PUBLIC_URL}/forms/Register_Form (1).pdf;
  //     const pdfData = await fetch(pdfUrl).then((res) => res.arrayBuffer());
  //     const pdfDoc = await PDFDocument.load(pdfData);

  //     pdfDoc.registerFontkit(fontkit);
  //     const ubuntuFont = await pdfDoc.embedFont(fontBytes);

  //     const form = pdfDoc.getForm();

  //     // Ensure the field names match exactly what's in your PDF
  //     // form.getTextField("pdfjs_internal_id_342R").setText("hohoho");
  //     // form.getTextField("pdfjs_internal_id_342R").setText("hohoho");
  //     // form.getTextField('address').setText("hh");
  //     // Repeat for each form field...

  //     form.updateFieldAppearances(ubuntuFont); // Update appearances with the embedded font

  //     const filledPdfBytes = await pdfDoc.save();
  //     return filledPdfBytes;
  //   } catch (error) {
  //     console.error('Error generating filled PDF:', error);
  //     throw error; // Ensure error handling is in place
  //   }
  // };

  // const updateFilledPDF = async () => {
  //   try {

  //     // Load existing PDF bytes
  //     const filledPdfBytes = await generateFilledPDF();
  //     const blob = new Blob([filledPdfBytes], { type: 'application/pdf' });
  //     console.log(blob)
  //     const pdfUrl = URL.createObjectURL(blob);
  //     window.open(pdfUrl);
  //     // saveAs(blob, 'filled_form.pdf');

  //   } catch (error) {
  //     console.error('Error updating filled PDF:', error);
  //   }
  // };
  const ifsubmit = false;
  return (
    <>
      {/* <Header /> */}
      {/* <Menu /> */}
      {/* <Header2/> */}
      <div className="w-full flex flex-col h-screen">
        <Menu />
        <div className="w-full flex h-screen overflow-hidden">
          <Sidebar />
          <div className="w-full px-9 overflow-y-scroll">
            <Outlet />
          </div>
          {/* <RecordList /> */}
        </div>
        {/* <Stepper /> */}
      </div>
      {/* <ReservationForm/> */}
      {/* <Sidebar isOpen={true}/> */}
    </>
  );
}

export default Reservation;
