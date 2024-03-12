import express from "express";
import { checkAuth } from "../middlewares/tokens.js";
import {
  createReservation,
  getReservationDetails,
  approveReservation,
  getAllReservationDetails,
  rejectReservation,
  holdReservation,
  getPendingReservations,
  getApprovedReservations,
  getRejectedReservations,
} from "../controllers/reservation.js";

const Router = express.Router();

Router.post("/", checkAuth, createReservation);

Router.get("/all", checkAuth, getAllReservationDetails);

Router.put("/approve/:id", checkAuth, approveReservation);
Router.put("/reject/:id", checkAuth, rejectReservation);
Router.put("/hold/:id", checkAuth, holdReservation);

Router.get("/pending", checkAuth, getPendingReservations);
Router.get("/approved", checkAuth, getApprovedReservations);
Router.get("/rejected", checkAuth, getRejectedReservations);

Router.get("/:id", checkAuth, getReservationDetails);
export default Router;
