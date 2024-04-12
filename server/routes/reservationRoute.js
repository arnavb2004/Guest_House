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
  updatePaymentStatus,
  getCurrentReservations,
  getPaymentPendingReservations,
  getCheckedOutReservations,
  getLateCheckoutReservations,
  checkoutReservation,
  checkoutToday,
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
Router.post("/rooms", checkAuth, addRooms);

Router.get("/all", checkAuth, getAllReservationDetails);
Router.get("/current", checkAuth, getCurrentReservations);
Router.get("/late", checkAuth, getLateCheckoutReservations);
Router.get("/checkedout", checkAuth, getCheckedOutReservations);
Router.get("/pending", checkAuth, getPendingReservations);
Router.get("/approved", checkAuth, getApprovedReservations);
Router.get("/rejected", checkAuth, getRejectedReservations);
Router.get("/documents/:id", checkAuth, getReservationDocuments);
Router.get("/rooms", checkAuth, getRooms);
Router.get("/payment/pending", checkAuth, getPaymentPendingReservations);
Router.get("/checkout/today", checkAuth, checkoutToday);

Router.get("/:id", checkAuth, getReservationDetails);

Router.put("/checkout/:id", checkAuth, checkoutReservation);
Router.put("/rooms/:id", checkAuth, updateRooms);
Router.put("/approve/:id", checkAuth, approveReservation);
Router.put("/reject/:id", checkAuth, rejectReservation);
Router.put("/hold/:id", checkAuth, holdReservation);
Router.put("/payment/:id", checkAuth, updatePaymentStatus);
Router.put("/:id/assign", checkAuth, assignReservation);
Router.put("/:id", checkAuth, updateReservation);

export default Router;
