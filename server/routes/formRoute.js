import express from "express";
import { checkAuth } from "../middlewares/tokens.js";
import {
  createReservation,
  getReservationDetails,
  approveReservation,
  getAllReservationDetails,
  rejectReservation,
} from "../controllers/roomreservation.js";

const Router = express.Router();

Router.post("/create", checkAuth, createReservation);

Router.get("/details/:id", checkAuth, getReservationDetails);
Router.get("/details", checkAuth, getAllReservationDetails);

Router.put("/approve/:id", checkAuth, approveReservation);
Router.put("/reject/:id", checkAuth, rejectReservation);

export default Router;
