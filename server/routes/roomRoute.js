import express from "express";
import { getAllRooms } from "../controllers/room.js";

const Router = express.Router();

Router.get("/rooms", getAllRooms);

export default Router;
