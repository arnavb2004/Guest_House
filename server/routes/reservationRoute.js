import express from "express";
import { checkAuth } from "../middlewares/tokens.js";
import { upload } from "../middlewares/fileStore.js";

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
  getRooms,
  addRooms,
  updateRooms,
  sendNotification,
  updatePaymentStatus
} from "../controllers/reservation.js";

const Router = express.Router();

Router.post(
  "/",
  checkAuth,
  upload.fields([
    { name: "files", maxCount: 5 },
    { name: "receipt", maxCount: 1 },
  ]),
  createReservation
);

Router.get("/all", checkAuth, getAllReservationDetails);
Router.get("/pending", checkAuth, getPendingReservations);
Router.get("/approved", checkAuth, getApprovedReservations);
Router.get("/rejected", checkAuth, getRejectedReservations);
Router.get("/documents/:id", checkAuth, getReservationDocuments);
Router.get("/rooms", checkAuth, getRooms);
Router.post("/rooms", checkAuth, addRooms);
Router.put("/rooms/:id", checkAuth, updateRooms);


Router.get("/:id", checkAuth, getReservationDetails);

Router.put("/approve/:id", checkAuth, approveReservation);
Router.put("/reject/:id", checkAuth, rejectReservation);
Router.put("/hold/:id", checkAuth, holdReservation);
Router.put("/payment/:id",checkAuth,updatePaymentStatus);
Router.put("/:id/assign", checkAuth, assignReservation);
Router.put("/:id", checkAuth, updateReservation);

export default Router;
