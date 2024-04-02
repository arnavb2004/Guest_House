import Reservation from "../models/Reservation.js";
import Room from "../models/Room.js";
import User from "../models/User.js";
import { getDate, getTime, transporter } from "../utils.js";
import archiver from "archiver";
import { getFileById } from "../middlewares/fileStore.js";
import mongoose from "mongoose";
import { google } from 'googleapis'
import keys from '../secrets.json' assert { type: 'json' };

const googleSheets = google.sheets('v4');
const auth = new google.auth.JWT(
  keys.client_email, 
  null, 
  keys.private_key, 
  ['https://www.googleapis.com/auth/spreadsheets']
);

const spreadsheetId = `${process.env.GOOGLE_SHEET_ID}`; // Replace with your Google Sheet's ID

async function appendReservationToSheet(reservation) {
  console.log("Entred Logic");
  await auth.authorize();
  console.log("Entred Logic2");
  const response = await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: 'Sheet1', // Assuming you are using the first sheet; change if necessary
    valueInputOption: 'RAW',
    resource: {
      values: [
        [
          reservation.guestName,
          reservation.guestEmail,
          reservation.numberOfGuests,
          reservation.numberOfRooms,
          reservation.roomType,
          reservation.arrivalDate,
          reservation.departureDate,
          reservation.purpose,
          reservation.category
          // Add more fields as necessary
        ],
      ],
    },
  });
  console.log("Exit Logic");
  return response;
}

// Use this function where you handle the reservation creation
// For example, in your createReservation function:
// await appendReservationToSheet(reservation);


async function sendVerificationEmail(to, subject, body) {
  try {
    const info = await transporter.sendMail({
      from: "dep.test.p04@gmail.com",
      to: to, // list of receivers
      subject: subject, // Subject line
      html: body, // plain text body
    });
    console.log("Message sent", info.messageId);
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
}

export async function createReservation(req, res) {
  try {
    //user details are contained in req.user

    // console.log(req.body);

    const {
      numberOfGuests,
      numberOfRooms,
      roomType,
      purpose,
      guestName,
      arrivalDate,
      arrivalTime,
      departureTime,
      address,
      category,
      departureDate,
    } = req.body;

    // console.log(arrivalTime);

    const email = req.user.email;
    const receiptid = req.files["receipt"][0].id;
    const fileids = req.files["files"]?.map((f) => ({
      refid: f.id,
      extension: f.originalname.split(".")[1],
    }));
    const reservation = await Reservation.create({
      guestEmail: email,
      guestName,
      address,
      purpose,
      numberOfGuests,
      numberOfRooms,
      roomType,
      arrivalDate: new Date(`${arrivalDate}T${arrivalTime}`),
      departureDate: new Date(`${departureDate}T${departureTime}`),
      category,
      stepsCompleted: 1,
      files: fileids,
      reviewers: [{ role: "ADMIN", status: "PENDING", comments: "" }],
      receipt: receiptid,
    });

    await appendReservationToSheet(reservation);

    console.log("sending mail");

    sendVerificationEmail(
      "hardik32904@gmail.com",
      "New Reservation Request",
      "<div>A new reservation request has been made.</div><br><br><div>Guest Name: " +
        guestName +
        "</div><br><div>Guest Email: " +
        email +
        "</div><br><div>Number of Guests: " +
        numberOfGuests +
        "</div><br><div>Number of Rooms: " +
        numberOfRooms +
        "</div><br><div>Room Type: " +
        roomType +
        "</div><br><div>Purpose: " +
        purpose +
        "</div><br><div>Arrival Date: " +
        getDate(arrivalDate) +
        "</div><br><div>Arrival Time: " +
        arrivalTime +
        "</div><br><div>Departure Date: " +
        getDate(departureDate) +
        "</div><br><div>Departure Time: " +
        departureTime +
        "</div><br><div>Address: " +
        address +
        "</div><br><div>Category: " +
        category +
        "</div>"
    );
    res.status(200).json({
      message:
        "Reservation Request added successfully. Please wait for approval from the admin.",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getAllReservationDetails(req, res) {
  try {
    if (req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "You are not authorized to view this application" });
    }
    console.log("Getting all reservations...");
    const reservations = await Reservation.find();
    res.status(200).json({ reservations });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function updateReservation(req, res) {
  try {
    if (req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }
    await Reservation.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({ message: "Reservation Updated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
export async function assignReservation(req, res) {
  try {
    if (req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }
    const reservation = await Reservation.findById(req.params.id);
    reservation.reviewers = req.body.reviewers.map((r) => ({
      role: r,
      status: "PENDING",
      comments: "",
    }));
    await reservation.save();
    res.status(200).json({ message: "Reservation Approved" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getReservationDetails(req, res) {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (
      req.user.email != reservation.guestEmail &&
      req.user.role !== "ADMIN" &&
      !reservation.reviewers.find((r) => r.role === req.user.role)
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to view this application" });
    }
    res.status(200).json({ reservation });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getReservationDocuments(req, res) {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (
      req.user.email !== reservation.guestEmail &&
      req.user.role !== "ADMIN" &&
      !reservation.reviewers.find((r) => r.role === req.user.role)
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to view this application" });
    }
    const archive = archiver("zip");
    res.attachment("files.zip");
    archive.pipe(res);
    for (const fileId of reservation.files) {
      const downloadStream = await getFileById(fileId.refid);
      archive.append(downloadStream, {
        name: `${req.user.email}_${fileId.refid}.${fileId.extension}`,
      });
    }
    const receiptStream = await getFileById(reservation.receipt);
    archive.append(receiptStream, { name: `Receipt_${reservation._id}.pdf` });
    archive.finalize();
    res.on("finish", () => {
      console.log("Download finished");
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function approveReservation(req, res) {
  try {
    let reservation = await Reservation.findById(req.params.id);
    if (
      req.user.role !== "ADMIN" &&
      !reservation.reviewers.find((r) => {
        r.role === req.user.role

      })
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }

    reservation.reviewers = reservation.reviewers.map((reviewer) => {
      if (reviewer.role === req.user.role) {
        reviewer.status = "APPROVED";
        if (req.body.comments) reviewer.comments = req.body.comments;
      }
      return reviewer;
    });
    let initStatus = reservation.status;
    reservation = updateReservationStatus(reservation);
    console.log(reservation);
    //add the message to the user model of who made the reservation
    if (initStatus !== reservation.status) {
      console.log(reservation.guestEmail);
      const resUser = await User.findOne({ email: reservation.guestEmail });
      console.log(resUser);
      if (resUser.notifications == null) {
        // console.log()
        resUser.notifications = [];
      }
      // console.log(resUser.notifications)
      resUser.notifications.push({
        message: `Reservation Status changed to ${reservation.status} - ${
          req.body.comments || "No comments"
        }`,
        sender: req.user.role,
        res_id: reservation._id,
      });
      await resUser.save();
    }
    //
    // if(adminStatus === "APPROVED") {
    //   reservation.status = "APPROVED";
    // } else if(isApproved) {
    //   reservation.status = "PENDING";
    // } else {
    //   reservation.status = "REJECTED";
    // }

    // if (req.body.comments) reservation.comments = req.body.comments;

    // const body =
    //   "<div>Your reservation has been approved</div><br><div>Comments: " +
    //   req.body.comments +
    //   "</div>";
    // sendVerificationEmail(
    //   reservation.guestEmail,
    //   "Reservation status updated",
    //   body
    // );
    await reservation.save();
    res.status(200).json({ message: "Reservation Approved" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function rejectReservation(req, res) {
  try {
    let reservation = await Reservation.findById(req.params.id);
    if (
      req.user.role !== "ADMIN" &&
      !reservation.reviewers.find((r) => r.role === req.user.role)
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }
    reservation.reviewers = reservation.reviewers.map((reviewer) => {
      if (reviewer.role === req.user.role) {
        reviewer.status = "REJECTED";
        if (req.body.comments) reviewer.comments = req.body.comments;
      }
      return reviewer;
    });
    let initStatus = reservation.status;
    reservation = updateReservationStatus(reservation);
    if (initStatus !== reservation.status) {
      const resUser = await User.findOne({ email: reservation.guestEmail });
      if (resUser.notifications == null) {
        // console.log()
        resUser.notifications = [];
      }
      resUser.notifications.push({
        message: `Reservation Status changed to ${reservation.status} - ${
          req.body.comments || "No comments"
        }`,
        sender: req.user.role,
        res_id: reservation._id,
      });
      await resUser.save();
    }

    // const body =
    //   "<div>Your reservation has been rejected</div><br><div>Comments: " +
    //   req.body.comments +
    //   "</div>";
    // sendVerificationEmail(
    //   reservation.guestEmail,
    //   "Reservation status updated",
    //   body
    // );

    await reservation.save();
    res.status(200).json({ message: "Reservation Rejected" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function holdReservation(req, res) {
  try {
    
    let reservation = await Reservation.findById(req.params.id);
    if (
      req.user.role !== "ADMIN" &&
      !reservation.reviewers.find((r) => r.role === req.user.role)
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }
    reservation.reviewers = reservation.reviewers.map((reviewer) => {
      if (reviewer.role === req.user.role) {
        reviewer.status = "HOLD";
        if (req.body.comments) reviewer.comments = req.body.comments;
      }
      return reviewer;
    });
    let initStatus = reservation.status;
    reservation = updateReservationStatus(reservation);
    if (initStatus !== reservation.status) {
      const resUser = await User.findOne({ email: reservation.guestEmail });
      if (resUser.notifications == null) {
        // console.log()
        resUser.notifications = [];
      }
      resUser.notifications.push({
        message: `Reservation Status changed to ${reservation.status} - ${
          req.body.comments || "No comments"
        }`,
        sender: req.user.role,
        res_id: reservation._id,
      });
      await resUser.save();
    }

    // const body =
    //   "<div>Your reservation has been put on hold.</div><br><div>Comments: " +
    //   req.body.comments +
    //   "</div>";
    // sendVerificationEmail(
    //   reservation.guestEmail,
    //   "Reservation status updated",
    //   body
    // );

    await reservation.save();
    res.status(200).json({ message: "Reservation on hold" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const getPendingReservations = async (req, res) => {
  console.log("Getting pending reservations...");
  try {
    if (req.user.role === "USER") {
      const reservations = await Reservation.find({
        guestEmail: req.user.email,
        status: "PENDING",
      }).sort({
        createdAt: -1,
      });
      return res.status(200).json(reservations);
    } else if (req.user.role === "ADMIN") {
      const reservations = await Reservation.find({
        status: "PENDING",
      }).sort({
        createdAt: -1,
      });
      res.status(200).json(reservations);
    } else {
      const reservations = await Reservation.find({
        reviewers: {
          $elemMatch: {
            role: req.user.role,
            status: "PENDING",
          },
        },
      }).sort({
        createdAt: -1,
      });
      res.status(200).json(reservations);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getApprovedReservations = async (req, res) => {
  console.log("Getting approved reservations...");
  try {
    if (req.user.role === "USER") {
      const reservations = await Reservation.find({
        guestEmail: req.user.email,
        status: "APPROVED",
      }).sort({
        createdAt: -1,
      });
      return res.status(200).json(reservations);
    } else if (req.user.role === "ADMIN") {
      const reservations = await Reservation.find({
        status: "APPROVED",
      }).sort({
        createdAt: -1,
      });
      res.status(200).json(reservations);
    } else {
      const reservations = await Reservation.find({
        reviewers: {
          $elemMatch: {
            role: req.user.role,
            status: "APPROVED",
          },
        },
      }).sort({
        createdAt: -1,
      });
      res.status(200).json(reservations);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRejectedReservations = async (req, res) => {
  console.log("Getting rejected reservations...");
  try {
    if (req.user.role === "USER") {
      const reservations = await Reservation.find({
        guestEmail: req.user.email,
        status: "REJECTED",
      }).sort({
        createdAt: -1,
      });
      return res.status(200).json(reservations);
    } else if (req.user.role === "ADMIN") {
      const reservations = await Reservation.find({
        status: "REJECTED",
      }).sort({
        createdAt: -1,
      });
      res.status(200).json(reservations);
    } else {
      const reservations = await Reservation.find({
        reviewers: {
          $elemMatch: {
            role: req.user.role,
            status: "REJECTED",
          },
        },
      }).sort({
        createdAt: -1,
      });
      res.status(200).json(reservations);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }
    reservation.payment.status = req.body.status;
    reservation.payment.amount = req.body.amount;
    reservation.payment.payment_method = req.body.payment_method;
    reservation.payment.transaction_id = req.body.transaction_id;
    console.log(reservation);
    console.log("Updated the payment status");
    await reservation.save();
    res.status(200).json({ message: "Payment status updated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateReservationStatus = (reservation) => {
  let initStatus = reservation.status;
  let reviewers = reservation.reviewers;

  let isApproved = true;
  let isRejected = false;
  let adminStatus;
  reviewers.forEach((reviewer) => {
    if (reviewer.status !== "APPROVED") {
      isApproved = false;
    }
    if (reviewer.status === "REJECTED") {
      isRejected = true;
    }
    if (reviewer.role === "ADMIN") {
      adminStatus = reviewer.status;
    }
  });

  if (adminStatus === "APPROVED") {
    reservation.status = "APPROVED";
  } else if (adminStatus === "REJECTED") {
    reservation.status = "REJECTED";
  } else if (isApproved) {
    reservation.status = "APPROVED";
  } else if (isRejected) {
    reservation.status = "REJECTED";
  } else {
    reservation.status = "PENDING";
  }
  if(reservation.status === "APPROVED" ) {
    reservation.stepsCompleted = 2;
  } else {
    reservation.stepsCompleted = 1;
  }
  return reservation;
};

export const getRooms = async (req, res) => {
  if (req.user?.role !== "ADMIN")
    return res
      .status(403)
      .json({ message: "You are not authorized to perform this action" });
  try {
    const rooms = await Room.find().sort({ roomNumber: 1 });
    console.log("Rooms", rooms);
    res.status(200).json(rooms);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const addRooms = async (req, res) => {
  if (req.user?.role !== "ADMIN")
    return res
      .status(403)
      .json({ message: "You are not authorized to perform this action" });

  console.log("room list", req.body);
  try {
    const roomList = req.body;
    roomList.forEach(async (room) => {
      await Room.create(room);
    });
    res.status(200).json({ message: "Rooms added" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

async function isDateRangeAvailable(room, startDate, endDate) {
  for (const booking of room.bookings) {
    const bookingStartDate = new Date(booking.startDate).toISOString();
    const bookingEndDate = new Date(booking.endDate).toISOString();

    if (room.roomNumber == 108) {
      console.log(bookingStartDate, bookingEndDate, startDate, endDate);
    }
    // Check for intersection
    if (bookingStartDate < endDate && bookingEndDate > startDate) {
      if (room.roomNumber == 108) console.log("Intersection");
      return false; // Date range intersects with existing booking
    }
  }

  if (room.roomNumber == 108) console.log("No intersection");

  return true; // Date range is available
}

// Function to update rooms and reservation
export const updateRooms = async (req, res) => {

  if (req.user?.role !== "ADMIN") {
    return res
      .status(403)
      .json({ message: "You are not authorized to perform this action" });
  }
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const allottedRooms = req.body;
    const id = req.params.id;
    for (const allottedRoom of allottedRooms) {
      const { roomNumber, startDate, endDate } = allottedRoom;

      const room = await Room.findOne({ roomNumber });
      if (!room) {
        throw new Error(`Room with number ${roomNumber} not found`);
      }

      const isAvailable = await isDateRangeAvailable(room, startDate, endDate);

      if (isAvailable) {
        // Update the room bookings to mark the specified period as booked
        room.bookings.push({
          startDate: allottedRoom.startDate,
          endDate: allottedRoom.endDate,
          user: allottedRoom.user,
        });
      }

      await room.save();

      

      // Update the reservation document to reflect the assigned rooms for the user
    }

    const reservation = await Reservation.findByIdAndUpdate(
      id, // Assuming user has an _id property
      { $set: { bookings: allottedRooms, stepsCompleted: 3 }},
      { session }
    );

    if (!reservation) {
      throw new Error("Failed to update reservation");
    }
    await session.commitTransaction();
    session.endSession();
    res
      .status(200)
      .json({ message: "Rooms and reservation updated successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error updating rooms and reservation:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const sendNotification = async (req, res) => {
  try {
    if (req.user.role === "USER") {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }
    const { message, sender, res_id } = req.body;
    sender = req.user.role;
    const user = await User.findById(req.params.id);
    user.notifications.push({ message, sender, res_id });
    await user.save();
    res.status(200).json({ message: "Notification sent" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
