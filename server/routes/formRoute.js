import express from "express";
import { checkAuth } from "../middlewares/tokens.js";
import {
  createReservation,
  getReservationDetails,
  approveReservation,
  getAllReservationDetails,
} from "../controllers/roomreservation.js";

const Router = express.Router();

Router.post("/create", checkAuth, createReservation);

Router.get("/details/:id", checkAuth, getReservationDetails);
Router.get("/details", checkAuth, getAllReservationDetails);

Router.put("/approve/:id", checkAuth, approveReservation);

export default Router;
