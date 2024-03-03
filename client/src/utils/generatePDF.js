import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";



export const generateFilledPDF = async (formData) => {
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

export const updateFilledPDF = async (formData) => {
  console.log("herer");
  try {
    // Load existing PDF bytes
    const filledPdfBytes = await generateFilledPDF(formData);
    const blob = new Blob([filledPdfBytes], { type: "application/pdf" });
    console.log(blob);
    const pdfUrl = URL.createObjectURL(blob);
    window.open(pdfUrl);
    // saveAs(blob, 'filled_form.pdf');
  } catch (error) {
    console.error("Error updating filled PDF:", error);
  }
};
