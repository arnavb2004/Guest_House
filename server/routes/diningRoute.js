import express from "express";

import { checkAuth } from "../middlewares/tokens.js";
import { createOrder, getOrder, getOrders } from "../controllers/dining.js";

const Router = express.Router();
Router.post("/", checkAuth, createOrder);
Router.get("/all", checkAuth, getOrders);
Router.get("/:id", checkAuth, getOrder);

export default Router;
