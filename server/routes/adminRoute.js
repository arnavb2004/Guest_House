import User from "../models/userModel.js";
import Reservation from "../models/reservationModel.js";
import express from "express";
const Router = express.Router();
import { checkAuth } from "../middlewares/tokens.js";



export default Router;
