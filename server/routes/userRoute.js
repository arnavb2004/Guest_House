import express from "express";

import { checkAuth } from "../middlewares/tokens.js";
import { getAllUsers, getUser } from "../controllers/user.js";

const Router = express.Router();
Router.get("/all", checkAuth, getAllUsers);
Router.get("/:id", checkAuth, getUser);

export default Router;
