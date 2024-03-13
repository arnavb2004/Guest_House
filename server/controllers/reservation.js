import Reservation from "../models/reservationModel.js";
import { transporter } from "../utils.js";

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
    //user details are contained in req.body.user

    console.log(req.body);

    const {
      numberOfGuests,
      numberOfRooms,
      roomType,
      purpose,
      guestName,
      arrivalDate,
      arrivalTime,
      address,
      category,
      departureTime,
      departureDate,
    } = req.body;

    console.log(arrivalTime);

    const email = req.body.user.email;
    console.log(req.body);
    const reservation = await Reservation.create({
      guestEmail: email,
      guestName,
      address,
      purpose,
      arrivalTime,
      departureTime,
      numberOfGuests,
      numberOfRooms,
      roomType,
      arrivalDate,
      departureDate,
      category,
    });
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
        arrivalDate +
        "</div><br><div>Arrival Time: " +
        arrivalTime +
        "</div><br><div>Departure Date: " +
        departureDate +
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
    if (req.body.user.role !== "ADMIN") {
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

export async function getReservationDetails(req, res) {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (
      req.body.user.email != reservation.guestEmail &&
      req.body.user.role !== "ADMIN"
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

export async function approveReservation(req, res) {
  if (req.body.user.role !== "ADMIN") {
    return res
      .status(403)
      .json({ message: "You are not authorized to perform this action" });
  }
  try {
    const reservation = await Reservation.findById(req.params.id);
    reservation.status = "APPROVED";
    reservation.approvals.push(req.body.user._id);
    if (req.body.comments) reservation.comments = req.body.comments;
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
  if (req.body.user.role !== "ADMIN") {
    return res
      .status(403)
      .json({ message: "You are not authorized to perform this action" });
  }
  try {
    const reservation = await Reservation.findById(req.params.id);
    reservation.status = "REJECTED";
    reservation.approvals = reservation.approvals.filter(
      (res) => res !== req.body.user._id
    );
    if (req.body.comments) reservation.comments = req.body.comments;
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
  if (req.body.user.role !== "ADMIN") {
    return res
      .status(403)
      .json({ message: "You are not authorized to perform this action" });
  }
  try {
    const reservation = await Reservation.findById(req.params.id);
    reservation.status = "HOLD";
    reservation.approvals = reservation.approvals.filter(
      (res) => res !== req.body.user._id
    );
    if (req.body.comments) reservation.comments = req.body.comments;

    const body =
      "<div>Your reservation has been put on hold.</div><br><div>Comments: " +
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

export const getPendingReservations = async (req, res) => {
  console.log("Getting pending reservations...");
  if (req.body.user.role !== "ADMIN") {
    const reservations = await Reservation.find({
      guestEmail: req.body.user.email,
      status: "PENDING",
    }).sort({
      createdAt: -1,
    });
    return res.status(200).json(reservations);
  }
  try {
    const reservations = await Reservation.find({ status: "PENDING" }).sort({
      createdAt: -1,
    });
    res.status(200).json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getApprovedReservations = async (req, res) => {
  console.log("Getting approved reservations...");
  if (req.body.user.role !== "ADMIN") {
    const reservations = await Reservation.find({
      guestEmail: req.body.user.email,
      status: "APPROVED",
    }).sort({
      createdAt: -1,
    });
    return res.status(200).json(reservations);
  }
  try {
    const reservations = await Reservation.find({ status: "APPROVED" }).sort({
      createdAt: -1,
    });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRejectedReservations = async (req, res) => {
  console.log("Getting rejected reservations...");
  if (req.body.user.role !== "ADMIN") {
    const reservations = await Reservation.find({
      guestEmail: req.body.user.email,
      status: "REJECTED",
    }).sort({
      createdAt: -1,
    });
    return res.status(200).json(reservations);
  }
  try {
    const reservations = await Reservation.find({ status: "REJECTED" }).sort({
      createdAt: -1,
    });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
