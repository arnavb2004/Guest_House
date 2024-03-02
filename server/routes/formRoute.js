import express from "express";
const Router = express.Router();
import Reservation from "../models/reservationModel.js";
import {checkAuth}  from "../middlewares/tokens.js";
import {createReservation,getReservationDetails,approveReservation} from "../controllers/roomreservation.js";
import { get } from "mongoose";
Router.post('/create',checkAuth,createReservation)

Router.get('/details/:id',checkAuth,getReservationDetails)

Router.post('/approve/:id',checkAuth,approveReservation)

export default Router;
