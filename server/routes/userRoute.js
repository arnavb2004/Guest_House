import express from "express";

import { checkAuth } from "../middlewares/tokens.js";
import { getAllUsers, getUser, updateUser ,getNotifications, deleteNotification, updateRole} from "../controllers/user.js";
import { get } from "mongoose";

const Router = express.Router();
Router.get("/all", checkAuth, getAllUsers);
Router.get("/notifications", checkAuth, getNotifications)
Router.put("/notifications/delete/:id", checkAuth, deleteNotification)
Router.get("/:id", checkAuth, getUser);
Router.put("/updateRole", checkAuth, updateRole);
Router.put("/:id", checkAuth, updateUser);
export default Router;
