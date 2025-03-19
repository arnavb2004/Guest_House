import Reservation from "../models/Reservation.js";
import Room from "../models/Room.js";
import User from "../models/User.js";
import Meal from "../models/Meal.js";
import { getDate, getTime, transporter } from "../utils.js";
import archiver from "archiver";
import { getFileById } from "../middlewares/fileStore.js";
import mongoose from "mongoose";
import { google } from "googleapis";
import {
  appendReservationToSheet,
  appendReservationToSheetAfterCheckout,
} from "./google_sheet.js";

const googleSheets = google.sheets("v4");
const auth = new google.auth.JWT(
  process.env.client_email,
  null,
  process.env.private_key,
  ["https://www.googleapis.com/auth/spreadsheets"]
);

const spreadsheetId = `${process.env.GOOGLE_SHEET_ID}`;

async function sendVerificationEmail(to, subject, body) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: to.length > 0 ? to : process.env.EMAIL_USER, // list of receivers
      subject: subject, // Subject line
      html: body, // plain text body
    });
    console.log("Message sent", info.messageId);
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
}

export const getAllRooms = async (req, res) => {
  try {
    // console.log("hey");
      const currentDate = new Date(); 

      const rooms = await Room.find(); 

      const updatedRooms = rooms.map(room => {
        const futureBookings = room.bookings.filter(booking => 
          new Date(booking.endDate) >= currentDate 
        );

        return { ...room._doc, bookings: futureBookings }; 
      });

      res.json(updatedRooms); 
    } catch (error) {
      res.status(500).json({ message: "Error fetching rooms", error });
    }
};

export async function EditReservation(req, res) {
  try {
    const { id } = req.params;
    console.log("Updating reservation ID:", id);

    const {
      numberOfGuests,
      numberOfRooms,
      roomType,
      purpose,
      guestName,
      arrivalDate,
      arrivalTime,
      departureDate,
      departureTime,
      address,
      category,
      source,
      applicant,
    } = req.body;

    let reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Calculate room cost
    const days = Math.ceil(
      (new Date(departureDate) - new Date(arrivalDate)) / (1000 * 60 * 60 * 24)
    );
    let room_cost = 0;

    const roomRates = {
      A: { single: 0, double: 0 },
      B: { single: 600, double: 850 },
      C: { single: 900, double: 1250 },
      D: { single: 1300, double: 1800 },
    };

    if (category in roomRates) {
      room_cost =
        roomType === "Single Occupancy"
          ? roomRates[category].single * numberOfRooms * days
          : roomRates[category].double * numberOfRooms * days;
    }

    const user = await User.findById(req.user._id);
    if(!user) console.log("user not found");
    console.log("user :",user);
    if (reservation.status!=="PENDING" ) {
      user.pendingRequest = user.pendingRequest +1;
    }
    await user.save();
    
    // Update reservation details
    reservation.guestName = guestName;
    reservation.address = address;
    reservation.purpose = purpose;
    reservation.numberOfGuests = numberOfGuests;
    reservation.numberOfRooms = numberOfRooms;
    reservation.roomType = roomType;
    reservation.arrivalDate = new Date(`${arrivalDate}T${arrivalTime || "13:00"}`);
    reservation.departureDate = new Date(`${departureDate}T${departureTime || "11:00"}`);
    reservation.category = category;
    reservation.payment = { source, amount: room_cost };
    
    reservation.status = "PENDING";
    reservation.stepsCompleted = 1;
    reservation.room_cost = room_cost;
    reservation.applicant = applicant;
    
    await reservation.save();
    
    // Send email notification only if needed
    if (req.user?.email) {
      const email = req.user.email;
      sendVerificationEmail(
        [email], // Sending only to the user who made the update
        "Updated Reservation Request",
        `<div>Your reservation has been updated.</div><br><br>
        <div>Guest Name: ${guestName}</div>
        <div>Guest Email: ${email}</div>
        <div>Number of Guests: ${numberOfGuests}</div>
        <div>Number of Rooms: ${numberOfRooms}</div>
        <div>Room Type: ${roomType}</div>
        <div>Purpose: ${purpose}</div>
        <div>Arrival Date: ${new Date(arrivalDate).toISOString().split("T")[0]}</div>
        <div>Arrival Time: ${arrivalTime}</div>
        <div>Departure Date: ${new Date(departureDate).toISOString().split("T")[0]}</div>
        <div>Departure Time: ${departureTime}</div>
        <div>Address: ${address}</div>
        <div>Category: ${category}</div>`
      );
    }

    res.status(200).json({ message: "Reservation updated successfully." });
  } catch (error) {
    console.error("Error updating reservation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}



export async function createReservation(req, res) {
  try {
    //user details are contained in req.user

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
      reviewers,
      subroles,
      applicant,
      source,
    } = req.body;
    var room_cost;
    const ms = Number(
      new Date(departureDate).getTime() - new Date(arrivalDate).getTime()
    );
    console.log("ms",ms);
    const days = Number(ms / (1000 * 60 * 60 * 24));
    console.log(days);

    if (roomType == "Single Occupancy") {
      if (category == "A") room_cost = 0;
      else if (category == "B") room_cost = 600 * numberOfRooms * days;
      else if (category == "C") room_cost = 900 * numberOfRooms * days;
      else if (category == "D") room_cost = 1300 * numberOfRooms * days;
    } else {
      if (category == "A") room_cost = 0;
      else if (category == "B") room_cost = 850 * numberOfRooms * days;
      else if (category == "C") room_cost = 1250 * numberOfRooms * days;
      else if (category == "D") room_cost = 1800 * numberOfRooms * days;
    }
    //single rooms cost
    console.log(source);
    console.log(applicant[0]);
    let applicantData;
    if (applicant[0]) applicantData = JSON.parse(applicant[0]);
    console.log(applicantData);

    const email = req.user.email;
    const receiptid = req.files["receipt"][0].id;
    const fileids = req.files["files"]?.map((f) => ({
      refid: f.id,
      extension: f.originalname.split(".")[1],
    }));
    console.log(reviewers);
    console.log(subroles);
    let subrolesArray = subroles.split(",");
    let reviewersArray = reviewers.split(",").map((role, index) => ({
      role:
        role +
        (subrolesArray[index] !== "Select" ? " " + subrolesArray[index] : ""),
      comments: "",
      status: "PENDING",
    }));

    if (req.user.role === "ADMIN")
      reviewersArray = [{ role: "ADMIN", comments: "", status: "PENDING" }];

    const reservation = await Reservation.create({
      srno: 1,
      guestEmail: email,
      byAdmin: req.user.role === "ADMIN",
      guestName,
      address,
      purpose,
      numberOfGuests,
      numberOfRooms,
      roomType,
      arrivalDate: new Date(`${arrivalDate}T${arrivalTime || "13:00"}`),
      departureDate: new Date(`${departureDate}T${departureTime || "11:00"}`),
      category,
      stepsCompleted: 1,
      files: fileids,
      payment: { source: source, amount: room_cost, paymentId: "" },
      applicant: applicantData,
      reviewers: reviewersArray,
      receipt: receiptid,
    });

    let revArray = reviewersArray.map((reviewer) => reviewer.role);
    await appendReservationToSheet(reservation, category);

    console.log("sending mail");
    console.log("\n\n\n\n", reviewersArray, "\n\n\n\n");
    console.log(revArray);
    const users = await User.find({
      role: { $in: revArray },
    });
    console.log(users);
    const emails = users.map((user) => user.email);
    try {
      const user = await User.findOne({ email: email });
      //console.log(user);
      if (user) {
        user.pendingRequest += 1;
        emails.push(user.email);
        // Save the updated user document
        await user.save();
      } else {
        console.log("User not found");
      }
    } catch (err) {
      console.log("Error updating user:", err);
    }
    
    
    //console.log(emails.length);
    sendVerificationEmail(
      emails,
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
    if (req.user.role !== "ADMIN" && req.user.role !== "CASHIER") {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (
      reservation.payment.status === "PAID" &&
      reservation.status === "APPROVED"
    ) {
      reservation.stepsCompleted = 4;
    }

    await reservation.save();
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
      req.user.role !== "CASHIER" &&
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
    // res.status(200).json({ message: "Downloaded successfully" })
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function deleteReservations(req, res) {
  const { ids } = req.body;
  ids = ids.filter((id) => id !== "#" && id !== "");
  try {
    const reservations = await Reservation.find({ _id: { $in: ids } });
    for (const reservation of reservations) {
      if (
        req.user.email !== reservation.guestEmail &&
        req.user.role !== "ADMIN"
      ) {
        return res.status(403).json({
          message: "You are not authorized to delete this reservation",
        });
      }
    }
    await Reservation.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: "Reservations Deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function approveReservation(req, res) {
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
    let found = false;
    reservation.reviewers = reservation.reviewers.map((reviewer) => {
      if (reviewer.role === req.user.role) {
        found = true;
        reviewer.status = "APPROVED";
        if (req.body.comments) reviewer.comments = req.body.comments;
      }
      return reviewer;
    });

    if (!found && req.user.role === "ADMIN") {
      reservation.reviewers.push({
        role: req.user.role,
        status: "APPROVED",
        comments: req.body.comments || "",
      });
    }
    let initStatus = reservation.status;
    reservation = await updateReservationStatus(reservation);
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
    const body =
      "<div>Your reservation has been approved</div><br><div>Comments: " +
      req.body.comments +
      "</div>";
    sendVerificationEmail(
      reservation.guestEmail,
      "Reservation status updated",
      body
    );
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
    let found = false;
    reservation.reviewers = reservation.reviewers.map((reviewer) => {
      if (reviewer.role === req.user.role) {
        found = true;
        reviewer.status = "REJECTED";
        if (req.body.comments) reviewer.comments = req.body.comments;
      }
      return reviewer;
    });

    if (!found && req.user.role === "ADMIN") {
      reservation.reviewers.push({
        role: req.user.role,
        status: "REJECTED",
        comments: req.body.comments || "",
      });
    }
    let initStatus = reservation.status;
    reservation = await updateReservationStatus(reservation);
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

    const body =
      "<div>Your reservation has been rejected</div><br><div>Comments: " +
      req.body.comments +
      "</div>";
    sendVerificationEmail(
      reservation.guestEmail,
      "Reservation status updated",
      body
    );

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
    reservation = await updateReservationStatus(reservation);

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
  console.log(req.user.role);
  console.log(req.user.email);
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
    } else if (req.user.role !== "ADMIN") {
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
    } else {
      const reservations = await Reservation.find({ status: "PENDING" }).sort({
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

export const removeFromList = async (req, res) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Unauthorized action" });
  }

  const { id } = req.params; // Reservation ID
  const { roomNumber } = req.body; // Room to remove

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the reservation
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      throw new Error("Reservation not found");
    }

    // Find the room and remove its booking
    const room = await Room.findOne({ roomNumber });
    if (!room) {
      throw new Error(`Room ${roomNumber} not found`);
    }
    //console.log("room bookings", room.bookings);
    // Remove the booking from the room
    //console.log(reservation._id);
    // console.log(booking.roomNumber._id);
    room.bookings = room.bookings.filter((booking) => booking.resid !== reservation._id.toString() );
    await room.save();
    //console.log("updated room bookings", room.bookings);
    // Remove the room from the reservation
    
    reservation.bookings = reservation.bookings.filter((booking) => booking.roomNumber !== roomNumber);
    await reservation.save();

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: `Room ${roomNumber} unassigned successfully` });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: error.message || "Failed to remove room" });
  }
};

const updateReservationStatus = async (reservation) => {
  let initStatus = reservation.status;
  let reviewers = reservation.reviewers;
  const userEmail = reservation.guestEmail;

  let isApproved = false;
  let isRejected = false;
  let adminStatus;
  reviewers.forEach((reviewer) => {
    if (reviewer.role === "ADMIN") {
      adminStatus = reviewer.status;
    } else {
      if (reviewer.status === "APPROVED") {
        isApproved = true;
      }
      if (reviewer.status === "REJECTED") {
        isRejected = true;
      }
    }
  });
  if (adminStatus === "APPROVED") {
    isApproved = true;
  } else if (adminStatus === "REJECTED") {
    isRejected = true;
  }

  if (isRejected) {
    reservation.status = "REJECTED";
  } else if (isApproved) {
    reservation.status = "APPROVED";
  } else {
    reservation.status = "PENDING";
  }
  if (reservation.status === "APPROVED") {
    reservation.stepsCompleted = 2;
  } else {
    reservation.stepsCompleted = 1;
  }
  if (initStatus !== reservation.status) {
    try {
      const user = await User.findOne({ email: userEmail });
      if (user) {
        if (
          reservation.status === "APPROVED" ||
          reservation.status === "REJECTED"
        ) {
          user.pendingRequest = user.pendingRequest - 1;
        } else {
          user.pendingRequest = user.pendingRequest + 1;
        }

        // Save the updated user document
        await user.save();
      } else {
        console.log("User not found");
      }
    } catch (err) {
      console.log("Error updating user:", err);
    }
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

export const addRoom = async (req, res) => {
  if (req.user?.role !== "ADMIN")
    return res
      .status(403)
      .json({ message: "You are not authorized to perform this action" });
  try {
    const roomNumber = req.body.roomNumber;
    const roomType = req.body.roomType;
    const newRoom = await Room.create({ roomNumber: roomNumber , roomType: roomType});
    res.status(200).json({ message: "Room added Successfully", room: newRoom });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteRoom = async (req, res) => {
  if (req.user?.role !== "ADMIN")
    return res
      .status(403)
      .json({ message: "You are not authorized to perform this action" });

  try {
    const { roomId } = req.body;

    const deletedRoom = await Room.findByIdAndDelete(roomId);

    if (!deletedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (deletedRoom.bookings?.length > 0)
      return res.status(404).json({ message: "Room is occupied" });

    res
      .status(200)
      .json({ message: "Room deleted successfully", room: deletedRoom });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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
    const { id } = req.params; // Reservation ID
    const allottedRooms = req.body; // Updated room assignments

    // Fetch the previous reservation details
    const prevReservation = await Reservation.findById(id);
    if (!prevReservation) {
      throw new Error("Reservation not found", 404);
    }
    
    const RoomsRequest = prevReservation.numberOfRooms;
    
    const prevAllottedRooms = prevReservation.bookings;

    // Step 1: Remove old room assignments no longer in the updated list
    // for (const prevRoom of prevAllottedRooms) {
    //   // Check if the room exists in the new allottedRooms; if not, unassign it
    //   const isStillAssigned = allottedRooms.some(
    //     (room) =>
    //       room.roomNumber === prevRoom.roomNumber &&
    //       room.startDate === prevRoom.startDate &&
    //       room.endDate === prevRoom.endDate
    //   );

    //   if (!isStillAssigned) {
    //     const room = await Room.findOne({ roomNumber: prevRoom.roomNumber });
    //     if (!room) {
    //       throw new Error(
    //         `Room with number ${prevRoom.roomNumber} not found`,
    //         400
    //       );
    //     }

    //     // Remove the booking for the specified date range
    //     const bookingIndex = room.bookings.findIndex(
    //       (booking) =>
    //         getDate(booking.startDate) === getDate(prevRoom.startDate) &&
    //         getDate(booking.endDate) === getDate(prevRoom.endDate)
    //     );

    //     if (bookingIndex !== -1) {
    //       room.bookings.splice(bookingIndex, 1); // Unassign the room
    //       await room.save();
    //     }
    //   }
    // }
    const resid = prevReservation._id;
    // Step 2: Assign new rooms or update existing bookings
    for (const newRoom of allottedRooms) {
      const { roomNumber, startDate, endDate, user } = newRoom;

      const room = await Room.findOne({ roomNumber });
      if (!room) {
        throw new Error(`Room with number ${roomNumber} not found`, 400);
      }
      const alreadyAssigned = room.bookings.some(
        (booking) => booking.resid?.toString() === resid.toString()
      );
      // Check if the room is available for the specified date range
      if(!alreadyAssigned){
      const isAvailable = await isDateRangeAvailable(room, startDate, endDate);
      if (!isAvailable) {
        throw new Error(
          `Room ${roomNumber} is not available for the specified date range`,
          400
        );
      }
     
      // Add the new booking
      room.bookings.push({ startDate, endDate,resid, user });
      await room.save();
    }
    }

// const updatedBookings = [
  // Keep only the previous rooms that are NOT in the new allotment
  // ...prevReservation.bookings.filter(
//     (prevRoom) =>
//       !allottedRooms.some(
//         (newRoom) => newRoom.roomNumber === prevRoom.roomNumber
//       )
//   ),
//   ...allottedRooms, // Add the new/updated rooms
// ];

    // Step 3: Update the reservation document
    const updatedReservation = await Reservation.findByIdAndUpdate(
      id,
      { $set: { bookings: allottedRooms, stepsCompleted: 3 } },
      { new: true, session }
    );
    // const updatedReservation = await Reservation.findByIdAndUpdate(
    //   id,
    //   { $set: { bookings: updatedBookings, stepsCompleted: 3 } },  
    //   { new: true, session }
    // );

    if (!updatedReservation) {
      throw new Error("Failed to update reservation", 400);
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
    if(req.method === "PUT" && RoomsRequest > allottedRooms.length){
      return res.status(400).json({
        success: false,
        message: `Insufficient rooms allotted. Guest requested ${RoomsRequest} rooms, but only ${allottedRooms.length} assigned.`,
      });
    }
    res.status(200).json({
      message: "Rooms and reservation updated successfully",
      reservation: updatedReservation,
    });
  } catch (error) {
    // Rollback transaction in case of any error
    await session.abortTransaction();
    session.endSession();

    console.error("Error updating rooms and reservation:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update rooms and reservation",
    });
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

export const getCurrentReservations = async (req, res) => {
  try {
    if (req.user.role !== "CASHIER")
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    const reservations = await Reservation.find({
      departureDate: { $gte: new Date() },
      status: "APPROVED",
    });
    res.status(200).json(reservations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const getPaymentPendingReservations = async (req, res) => {
  try {
    if (req.user.role !== "CASHIER")
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    const reservations = await Reservation.find({
      // departureDate: { $gte: new Date() },
      "payment.status": "PENDING",
      status: "APPROVED",
    });
    console.log(reservations);
    res.status(200).json(reservations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const getCheckedOutReservations = async (req, res) => {
  try {
    if (req.user.role !== "CASHIER")
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    const reservations = await Reservation.find({
      checkOut: true,
    });
    res.status(200).json(reservations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getLateCheckoutReservations = async (req, res) => {
  try {
    if (req.user.role !== "CASHIER")
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    const reservations = await Reservation.find({
      departureDate: { $lt: new Date() },
      status: "APPROVED",
      checkOut: false,
    });
    res.status(200).json(reservations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const checkoutReservation = async (req, res) => {
  try {
    if (req.user.role !== "CASHIER")
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });

    const { id } = req.params;
    const reservation = await Reservation.findById(id);
    if (reservation.payment.status !== "PAID") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const dinings = await Meal.find({ _id: { $in: reservation.diningIds } });

    let canCheckout = true;

    for (const dining of dinings) {
      console.log(dining);
      console.log(dining.status);
      if (dining.payment.status !== "PAID") {
        canCheckout = false;
        break;
      }
    }

    if (!canCheckout) {
      return res
        .status(400)
        .json({ message: "Payment of dinings not completed" });
    }

    reservation.checkOut = true;
    await appendReservationToSheetAfterCheckout(reservation);
    await reservation.save();
    console.log("check res:", reservation);
    res.status(200).json({ message: "Checkout successful" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const checkoutToday = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for the start of today

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999); // Set hours, minutes, seconds, and milliseconds to the end of today

    const reservations = await Reservation.find({
      departureDate: { $gt: new Date(), $lte: todayEnd },
      status: "APPROVED",
      checkOut: false,
    });
    res.status(200).json(reservations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getDiningAmount = async (req, res) => {
  try {
    const { id } = req.body;
    const reservation = await Reservation.findById(id);
    const diningIds = reservation.diningIds;
    let totalAmount = 0;
    if (diningIds.length > 0) {
      const meals = await Meal.find({
        _id: { $in: diningIds },
      });
      totalAmount = meals.reduce((accumulator, currentObject) => {
        return accumulator + currentObject.amount;
      }, 0);
    }
    res.status(200).json({ totalAmount });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
