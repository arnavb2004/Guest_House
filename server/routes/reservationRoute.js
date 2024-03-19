import express from "express";
import { checkAuth } from "../middlewares/tokens.js";
import {upload} from "../middlewares/fileStore.js";

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
  getReservationDocuments,
  updateReservation,
  assignReservation,
} from "../controllers/reservation.js";


const Router = express.Router();



Router.post("/", checkAuth,createReservation);


Router.get("/all", checkAuth, getAllReservationDetails);
Router.get("/pending", checkAuth, getPendingReservations);
Router.get("/approved", checkAuth, getApprovedReservations);
Router.get("/rejected", checkAuth, getRejectedReservations);
Router.get("/documents/:id", checkAuth, getReservationDocuments);
Router.get("/:id", checkAuth, getReservationDetails);


Router.put("/approve/:id", checkAuth, approveReservation);
Router.put("/reject/:id", checkAuth, rejectReservation);
Router.put("/hold/:id", checkAuth, holdReservation);
Router.put("/:id/assign", checkAuth, assignReservation);
Router.put("/:id", checkAuth, updateReservation);


export default Router;
