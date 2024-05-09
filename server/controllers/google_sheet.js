import { google } from 'googleapis';
import Meal from "../models/Meal.js";

// const googleSheets = google.sheets("v4");
// const auth = new google.auth.JWT(
//   process.env.client_email,
//   null,
//   process.env.private_key,
//   ["https://www.googleapis.com/auth/spreadsheets"]
// );

import keys from '../secrets.json' assert { type: 'json' };

const googleSheets = google.sheets('v4');
const auth = new google.auth.JWT(
  keys.client_email,
  null,
  keys.private_key,
  ['https://www.googleapis.com/auth/spreadsheets']
);


const spreadsheetId = process.env.GOOGLE_SHEET_ID;

export async function appendReservationToSheet(reservation, category) {
    console.log("Entered Logic");
    await auth.authorize();
    console.log("Entered Logic2");

    let sheetName;
    let lastSrNo;
    let range;
    let newSrNo;
    let roomNumbers;

    switch (category) {
        case 'A':
            console.log("hello");
            sheetName = 'CATAFREE'
            lastSrNo = await getLastSrNo(sheetName);
            console.log("hello3");
            newSrNo = lastSrNo + 1;

            range = `${sheetName}`; // Use the determined sheet name
            console.log("hello2");
            console.log(newSrNo);
            updateCellValue(sheetName, newSrNo + 5, 1, newSrNo);
            updateCellValue(sheetName, newSrNo + 5, 2, reservation.srNo);
            updateCellValue(sheetName, newSrNo + 5, 3, reservation.srNo);
            updateCellValue(sheetName, newSrNo + 5, 5, reservation.arrivalDate);
            updateCellValue(sheetName, newSrNo + 5, 6, reservation.guestName);
            updateCellValue(sheetName, newSrNo + 5, 7, reservation.applicant.Name);
            roomNumbers = reservation.bookings.map(booking => booking.roomNumber).join(', ');
            updateCellValue(sheetName, newSrNo + 5, 8, roomNumbers);
            updateCellValue(sheetName, newSrNo + 5, 9, reservation.category);
            updateCellValue(sheetName, newSrNo + 5, 10, reservation.roomType)
            updateCellValue(sheetName, newSrNo + 5, 11, reservation.arrivalDate);
            updateCellValue(sheetName, newSrNo + 5, 12, reservation.departureDate);
            updateCellValue(sheetName, newSrNo + 5, 14, 0);
            updateCellValue(sheetName, newSrNo + 5, 15, 0);
            updateCellValue(sheetName, newSrNo + 5, 16, 0);
            updateCellValue(sheetName, newSrNo + 5, 17, 0);
            updateCellValue(sheetName, newSrNo + 5, 18, 0);
            break;
        case 'D':
            
            console.log("hello");
            sheetName = 'CatDUTR';
            lastSrNo = await getLastSrNo(sheetName);
            console.log("hello3");
            newSrNo = lastSrNo + 1;

            range = `${sheetName}`; // Use the determined sheet name
            console.log("hello2");
            console.log(newSrNo);
            updateCellValue(sheetName, newSrNo + 5, 1, newSrNo);
            updateCellValue(sheetName, newSrNo + 5, 2, reservation._id);
            updateCellValue(sheetName, newSrNo + 5, 3, reservation.srNo);
            updateCellValue(sheetName, newSrNo + 5, 5, reservation.arrivalDate);
            updateCellValue(sheetName, newSrNo + 5, 6, reservation.guestName);
            updateCellValue(sheetName, newSrNo + 5, 7, reservation.applicant.Name);
            roomNumbers = reservation.bookings.map(booking => booking.roomNumber).join(', ');
            updateCellValue(sheetName, newSrNo + 5, 8, roomNumbers);
            updateCellValue(sheetName, newSrNo + 5, 9, reservation.category);
            updateCellValue(sheetName, newSrNo + 5, 10, reservation.roomType)
            updateCellValue(sheetName, newSrNo + 5, 11, reservation.arrivalDate);
            updateCellValue(sheetName, newSrNo + 5, 12, reservation.departureDate);
            break;
        case 'C':
            sheetName = 'Sheet3';
            break;
        case 'D':
            sheetName = 'Sheet4';
            break;
        default:
            sheetName = 'Sheet5'; // Default sheet if category does not match
    }
    console.log("Exit Logic");
}

async function findRowByReservationId(sheetName, reservationId) {
    console.log("Sheet Name:", sheetName);
    try {
        // Get the sheet ID and data to find the row number for the given Sr No
        const sheetMetadataResponse = await googleSheets.spreadsheets.get({
            auth,
            spreadsheetId,
        });
        const sheetId = sheetMetadataResponse.data.sheets.find(s => s.properties.title === sheetName).properties.sheetId;

        const readResponse = await googleSheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: sheetName,
        });

        const rows = readResponse.data.values;
        console.log(rows[7]);
        console.log(rows[8][0]);
        console.log(rows[8][1]);
        console.log(rows[8][2]);
        console.log(reservationId);
        let rowIndex = rows.findIndex(row => (row[1] === reservationId.toString()));
        if (rowIndex === -1) {
            console.log("Reservation not found:", reservationId);
            return null;
        }
        return rowIndex;
        
    } catch (error) {
        console.error("Error finding row by reservation ID:", error);
        throw error;
    }
}

export async function appendReservationToSheetAfterCheckout(reservation) {
    console.log("Entered Logic");
    await auth.authorize();
    console.log("Entered Logic2");

    let sheetName;
    let lastSrNo;
    let range;
    let newSrNo;
    let roomNumbers;
    let category = reservation.category;
    let gst;
    let sgst;
    let grand_total;
    let TotaldiningAmount = 0;

    switch (category) {
        case 'A':
            console.log("hello");
            sheetName = 'CATAFREE'
            console.log("hello3");
            newSrNo = await findRowByReservationId(sheetName, reservation._id);
            newSrNo = newSrNo + 1;
            console.log(newSrNo);
            updateCellValue(sheetName, newSrNo, 3, reservation.srNo);
            roomNumbers = reservation.bookings.map(booking => booking.roomNumber).join(', ');
            updateCellValue(sheetName, newSrNo, 8, roomNumbers);
            break;

        case 'D':
            
            console.log("hello");
            sheetName = 'CatDUTR';
            console.log("hello3");
            newSrNo = await findRowByReservationId(sheetName, reservation._id);
            newSrNo = newSrNo + 1;
            console.log(newSrNo);
            updateCellValue(sheetName, newSrNo, 3, reservation.srNo);
            roomNumbers = reservation.bookings.map(booking => booking.roomNumber).join(', ');
            updateCellValue(sheetName, newSrNo, 8, roomNumbers);
            updateCellValue(sheetName, newSrNo, 15, reservation.payment.amount);
            gst = (reservation.payment.amount)*(0.06);
            sgst = (reservation.payment.amount)*(0.06);
            updateCellValue(sheetName, newSrNo, 16, gst);
            updateCellValue(sheetName, newSrNo, 17, sgst);
            grand_total = reservation.payment.amount + gst + sgst;
            updateCellValue(sheetName, newSrNo, 18, grand_total);
            updateCellValue(sheetName, newSrNo, 19, reservation.payment.paymentId);
            console.log(reservation.payment.paymentId);
            console.log("TillHere1");
            updateCellValue(sheetName, newSrNo, 20, reservation.payment.amount);
            console.log("TillHere2");
            const diningIds = reservation.diningIds;
            let diningPaymentIds = [];
            Promise.all(
                diningIds.map(async diningId => {
                    try {
                        const dining = await Meal.findById(diningId);
                        if (dining && dining.payment) {
                            diningPaymentIds.push(dining.payment.paymentId);
                            TotaldiningAmount += dining.payment.amount;
                        }
                    } catch (err) {
                        console.error('Error fetching dining:', err);
                    }
                })
            )
            .then(() => {
                diningPaymentIds = diningPaymentIds.join(', ');
                console.log('Dining Payment IDs:', diningPaymentIds);
                updateCellValue(sheetName, newSrNo, 21, diningPaymentIds);
            })
            .catch(err => {
                console.error('Error:', err);
            });
            updateCellValue(sheetName, newSrNo, 22, TotaldiningAmount);
            break;
            
        case 'C':
            sheetName = 'Sheet3';
            break;

        case 'D':
            sheetName = 'Sheet4';
            break;
        default:
            sheetName = 'Sheet5'; // Default sheet if category does not match
    }
    console.log("Exit Logic");
}

async function getLastSrNo(sheetName) {
    console.log(sheetName);
    const response = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: sheetName,
    });
    console.log(response)
    const data = response.data.values;
    console.log(data)
    if (data && data.length > 0) {
        return parseInt(data[data.length - 1][0]); // Assuming the first column contains the serial number
    } else {
        return 0; // Start from 1 if the sheet is empty
    }
}

async function updateCellValue(sheetName, row, column, newValue) {
    console.log("Entered Logic");
    await auth.authorize();
    console.log("Entered Logic2");

    let columnLetter = String.fromCharCode(64 + column); // Convert column number to letter
    const range = `${sheetName}!${columnLetter}${row}`;
    console.log(range)
    const response = await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: range,
        valueInputOption: 'RAW',
        resource: {
            values: [[newValue]],
        },
    });
    console.log("Exit Logic");
    return response;
}

async function fillRowFromColumn(sheetName, row, startColumn, data) {
    console.log("Entered Logic");
    await auth.authorize();
    console.log("Entered Logic2");

    // Convert the start column index to its corresponding letter in the spreadsheet
    let startColumnLetter = String.fromCharCode(64 + startColumn);
    const range = `${sheetName}!${startColumnLetter}${row}:${row}`;

    const response = await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: range,
        valueInputOption: 'RAW',
        resource: {
            values: [data], // Data array should be a 2D array representing a row of data
        },
    });
    console.log("Exit Logic");
    return response;
}

// Sample reservations for testing
// const sampleReservations = [
//     { guestName: 'John Doe', guestEmail: 'john@example.com', numberOfGuests: 2, numberOfRooms: 1, roomType: 'Deluxe', arrivalDate: '2024-04-10', departureDate: '2024-04-12', purpose: 'Vacation', category: 'c' },
//     { guestName: 'Jane Doe', guestEmail: 'jane@example.com', numberOfGuests: 4, numberOfRooms: 2, roomType: 'Suite', arrivalDate: '2024-04-15', departureDate: '2024-04-20', purpose: 'Business', category: 'b' }
// ];

// Testing the function for each category
// sampleReservations.forEach(reservation => {
//     appendReservationToSheet(reservation, reservation.category)
//         .then(response => console.log(`Reservation for category ${reservation.category} appended successfully.`))
//         .catch(error => console.error(`Error appending reservation for category ${reservation.category}:`, error));
// });

async function colorRowBySrNo(sheetName, srNo, color) {
    console.log("Entered Logic");
    await auth.authorize();
    console.log("Entered Logic2");

    // Get the sheet ID and data to find the row number for the given Sr No
    const sheetMetadataResponse = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId,
    });
    const sheetId = sheetMetadataResponse.data.sheets.find(s => s.properties.title === sheetName).properties.sheetId;

    const readResponse = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: sheetName,
    });

    const rows = readResponse.data.values;
    let rowIndex = rows.findIndex(row => parseInt(row[0]) === srNo);
    if (rowIndex === -1) {
        console.error('Serial number not found in the sheet');
        return;
    }

    // Prepare the batchUpdate request for coloring the row
    const requests = [{
        updateCells: {
            rows: [{
                values: Array(rows[rowIndex].length).fill({}).map(() => ({
                    userEnteredFormat: { backgroundColor: color }
                }))
            }],
            fields: 'userEnteredFormat.backgroundColor',
            range: {
                sheetId: sheetId,
                startRowIndex: rowIndex,
                endRowIndex: rowIndex + 1,
                startColumnIndex: 0,
                endColumnIndex: rows[rowIndex].length
            }
        }
    }];

    const response = await googleSheets.spreadsheets.batchUpdate({
        auth,
        spreadsheetId,
        resource: {
            requests: requests
        },
    });

    console.log("Exit Logic");
    return response;
}

// // Update a specific cell as an example
// updateCellValue('Sheet1', 5, 3, 'New Value')
//     .then(response => console.log('Cell updated successfully.'))
//     .catch(error => console.error('Error updating cell:', error));

    
// // Example usage
// const dataToFill = ['Payment Received', 'Visa', 'Completed']; // Data to fill starting from the specified column
// fillRowFromColumn('Sheet1', 5, 13, dataToFill) // Assuming you want to start from column M (13) in row 5
//     .then(response => console.log('Row updated successfully.'))
//     .catch(error => console.error('Error updating row:', error));

// // Example usage
// const color = { red: 1, green: 0, blue: 0 }; // Red color
// colorRowBySrNo('Sheet2', 2, color)  // Change row color where Sr No is 2
//     .then(response => console.log('Row color changed successfully.'))
//     .catch(error => console.error('Error changing row color:', error));
