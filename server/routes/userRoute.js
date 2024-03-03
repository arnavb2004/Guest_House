import { checkAuth } from "../middlewares/tokens.js";
import express from "express";
import { getUser } from "../controllers/user.js";

const Router = express.Router();

Router.post("/",checkAuth, getUser);

export default Router;
