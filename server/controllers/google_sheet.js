import { google } from 'googleapis';
import keys from '../secrets.json' assert { type: 'json' };

const googleSheets = google.sheets('v4');
const auth = new google.auth.JWT(
  keys.client_email,
  null,
  keys.private_key,
  ['https://www.googleapis.com/auth/spreadsheets']
);

const spreadsheetId = `1_sJJXxe49nSpc-zq7bo2qrzgJZKniz0h1lIiwMG5_wA`;

async function appendReservationToSheet(reservation, category) {
    console.log("Entered Logic");
    await auth.authorize();
    console.log("Entered Logic2");

    let sheetName;
    switch (category) {
        case 'a':
            sheetName = 'Sheet1';
            break;
        case 'b':
            sheetName = 'Sheet2';
            break;
        case 'c':
            sheetName = 'Sheet3';
            break;
        case 'd':
            sheetName = 'Sheet4';
            break;
        default:
            sheetName = 'Sheet5'; // Default sheet if category does not match
    }

    const lastSrNo = await getLastSrNo(sheetName);
    const newSrNo = lastSrNo + 1;

    const range = `${sheetName}`; // Use the determined sheet name
    const response = await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: range,
        valueInputOption: 'RAW',
        resource: {
            values: [
                [
                    newSrNo,
                    reservation.guestName,
                    reservation.guestEmail,
                    reservation.numberOfGuests,
                    reservation.numberOfRooms,
                    reservation.roomType,
                    reservation.arrivalDate,
                    reservation.departureDate,
                    reservation.purpose,
                    reservation.category
                ],
            ],
        },
    });
    console.log("Exit Logic");
    return response;
}

async function getLastSrNo(sheetName) {
    const response = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: sheetName,
    });

    const data = response.data.values;
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
const sampleReservations = [
    { guestName: 'John Doe', guestEmail: 'john@example.com', numberOfGuests: 2, numberOfRooms: 1, roomType: 'Deluxe', arrivalDate: '2024-04-10', departureDate: '2024-04-12', purpose: 'Vacation', category: 'c' },
    { guestName: 'Jane Doe', guestEmail: 'jane@example.com', numberOfGuests: 4, numberOfRooms: 2, roomType: 'Suite', arrivalDate: '2024-04-15', departureDate: '2024-04-20', purpose: 'Business', category: 'b' }
];

// Testing the function for each category
sampleReservations.forEach(reservation => {
    appendReservationToSheet(reservation, reservation.category)
        .then(response => console.log(`Reservation for category ${reservation.category} appended successfully.`))
        .catch(error => console.error(`Error appending reservation for category ${reservation.category}:`, error));
});

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

// Update a specific cell as an example
updateCellValue('Sheet1', 5, 3, 'New Value')
    .then(response => console.log('Cell updated successfully.'))
    .catch(error => console.error('Error updating cell:', error));

    
// Example usage
const dataToFill = ['Payment Received', 'Visa', 'Completed']; // Data to fill starting from the specified column
fillRowFromColumn('Sheet1', 5, 13, dataToFill) // Assuming you want to start from column M (13) in row 5
    .then(response => console.log('Row updated successfully.'))
    .catch(error => console.error('Error updating row:', error));

// Example usage
const color = { red: 1, green: 0, blue: 0 }; // Red color
colorRowBySrNo('Sheet2', 2, color)  // Change row color where Sr No is 2
    .then(response => console.log('Row color changed successfully.'))
    .catch(error => console.error('Error changing row color:', error));
