import express from "express";

import { checkAuth } from "../middlewares/tokens.js";
import { getAllUsers, getUser, updateUser } from "../controllers/user.js";

const Router = express.Router();
Router.get("/all", checkAuth, getAllUsers);
Router.get("/:id", checkAuth, getUser);
Router.put("/:id", checkAuth, updateUser);

export default Router;
