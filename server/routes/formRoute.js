import express from "express";
const Router = express.Router();
import Reservation from "../models/reservationModel.js";
import { checkAuth } from "../middlewares/tokens.js";

Router.post("/create", checkAuth, async (req, res) => {
  try {
    //user details are contained in req.body.user
    const email = req.body.user.email;
    const {
      numberOfGuests,
      numberOfRooms,
      roomType,
      arrivalDate,
      departureDate,
    } = req.body;

    console.log(req.body);

    await Reservation.create({
      guestEmail: email,
      numberOfGuests,
      numberOfRooms,
      roomType,
      arrivalDate,
      departureDate,
      status: "PENDING",
    });
    res.status(200).json({
      message:
        "Reservation Request added successfully. Please wait for approval from the admin.",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

Router.get("/details/:id", checkAuth, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (
      req.body.user.email !== reservation.guestEmail &&
      req.body.user.role !== "ADMIN"
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to view this application" });
    }
    res.status(200).json({
      user: reservation.guestEmail,
      status: reservation.status,
      approvals: reservation.approvals,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

Router.post("/approve/:id", checkAuth, async (req, res) => {
  if (req.body.user.role !== "ADMIN") {
    return res
      .status(403)
      .json({ message: "You are not authorized to perform this action" });
  }
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });
    reservation.status = "APPROVED";
    await reservation.save();
    res.status(200).json({ message: "Reservation Approved" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default Router;
