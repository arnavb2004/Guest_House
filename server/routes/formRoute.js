import express from "express";
import { checkAuth } from "../middlewares/tokens.js";
import {upload} from "../middlewares/fileStore.js";
import {
  createReservation,
  getReservationDetails,
  approveReservation,
  getAllReservationDetails,
  rejectReservation,
  getReservationDocuments,
} from "../controllers/roomreservation.js";

const Router = express.Router();

Router.post("/create", checkAuth,upload.array('files',10),createReservation);

Router.get("/details", checkAuth, getAllReservationDetails);
Router.get("/file-details/:id", checkAuth, getReservationDocuments);
Router.get("/details/:id", checkAuth, getReservationDetails);
Router.put("/approve/:id", checkAuth, approveReservation);
Router.put("/reject/:id", checkAuth, rejectReservation);

export default Router;
