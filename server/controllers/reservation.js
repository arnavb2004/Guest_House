import Reservation from "../models/Reservation.js";
import { getDate, getTime, transporter } from "../utils.js";
import archiver from "archiver";
import { getFileById } from "../middlewares/fileStore.js";
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
  console.log("body", req.body);
  console.log("user", req.user);
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
      address,
      category,
      departureDate,
    } = req.body;

    // console.log(arrivalTime);

    const email = req.user.email;
    // console.log(req.user);
    console.log(req);
    console.log(req.files["files"]);
    console.log(req.files["receipt"]);
    const receiptid = req.files["receipt"][0].id;
    const fileids = req.files["files"].map((f) => ({
      refid: f.id,
      extension: f.originalname.split(".")[1],
    }));
    console.log(fileids);
    const reservation = await Reservation.create({
      guestEmail: email,
      guestName,
      address,
      purpose,
      numberOfGuests,
      numberOfRooms,
      roomType,
      arrivalDate,
      departureDate,
      category,
      stepsCompleted: 0,
      files: fileids,
      reviewers: ["ADMIN"],
      receipt: receiptid,
    });

    console.log(reservation);
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
        getTime(arrivalDate) +
        "</div><br><div>Departure Date: " +
        getDate(departureDate) +
        "</div><br><div>Departure Time: " +
        getTime(departureDate) +
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
    res.status(200).json({ message: "Reservation Approved" });
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
    console.log(reservation);
    console.log(req.body);
    reservation.reviewers = req.body.reviewers;
    await reservation.save();
    console.log(reservation);
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
      !reservation.reviewers.includes(req.user.role)
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
      !reservation.reviewers.includes(req.user.role)
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
    // console.log(receiptStream);
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
    const reservation = await Reservation.findById(req.params.id);
    if (
      req.user.role !== "ADMIN" &&
      !reservation.reviewers.includes(req.user.role)
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }
    reservation.status = "APPROVED";
    reservation.approvals.push(req.user.role);
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
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (
      req.user.role !== "ADMIN" &&
      !reservation.reviewers.includes(req.user.role)
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }
    reservation.status = "REJECTED";
    reservation.approvals = reservation.approvals.filter(
      (res) => res !== req.user.role
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
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (
      req.user.role !== "ADMIN" &&
      !reservation.reviewers.includes(req.user.role)
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }
    reservation.status = "HOLD";
    reservation.approvals = reservation.approvals.filter(
      (res) => res !== req.user.role
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
  if (req.user.role === "USER") {
    const reservations = await Reservation.find({
      guestEmail: req.user.email,
      status: "PENDING",
    }).sort({
      createdAt: -1,
    });
    return res.status(200).json(reservations);
  }

  try {
    const reservations = await Reservation.find({
      status: "PENDING",
      reviewers: { $in: [req.user.role] },
    }).sort({
      createdAt: -1,
    });
    res.status(200).json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getApprovedReservations = async (req, res) => {
  console.log("Getting approved reservations...");
  if (req.user.role === "USER") {
    const reservations = await Reservation.find({
      guestEmail: req.user.email,
      status: "APPROVED",
    }).sort({
      createdAt: -1,
    });
    return res.status(200).json(reservations);
  }
  try {
    const reservations = await Reservation.find({
      status: "APPROVED",
      reviewers: { $in: [req.user.role] },
    }).sort({
      createdAt: -1,
    });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRejectedReservations = async (req, res) => {
  console.log("Getting rejected reservations...");
  if (req.user.role === "USER") {
    const reservations = await Reservation.find({
      guestEmail: req.user.email,
      status: "REJECTED",
    }).sort({
      createdAt: -1,
    });
    return res.status(200).json(reservations);
  }
  try {
    const reservations = await Reservation.find({
      status: "REJECTED",
      reviewers: { $in: [req.user.role] },
    }).sort({
      createdAt: -1,
    });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
