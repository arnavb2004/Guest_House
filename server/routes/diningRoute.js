import express from "express";

import { checkAuth } from "../middlewares/tokens.js";
import {
  createOrder,
  getOrder,
  getOrders,
  getPendingOrders,
  getApprovedOrders,
  getRejectedOrders,
  approveOrder,
  rejectOrder,
  holdOrder,
  updateOrder,
  assignOrder,
  getPaymentPendingDepartmentOrders,
  getPaymentApprovedDepartmentOrders,
  getPaymentPendingGuestOrders,
  getPaymentApprovedGuestOrders,
} from "../controllers/dining.js";

const Router = express.Router();

Router.post("/", checkAuth, createOrder);

Router.get("/all", checkAuth, getOrders);
Router.get("/pending", checkAuth, getPendingOrders);
Router.get("/approved", checkAuth, getApprovedOrders);
Router.get("/rejected", checkAuth, getRejectedOrders);
Router.get("/payment-pending-department", checkAuth, getPaymentPendingDepartmentOrders);
Router.get("/payment-pending-guest", checkAuth, getPaymentPendingGuestOrders);
Router.get("/payment-done-department", checkAuth, getPaymentApprovedDepartmentOrders);
Router.get("/payment-done-guest", checkAuth, getPaymentApprovedGuestOrders);
Router.get("/:id", checkAuth, getOrder);

Router.put("/approve/:id", checkAuth, approveOrder);
Router.put("/reject/:id", checkAuth, rejectOrder);
Router.put("/hold/:id", checkAuth, holdOrder);
Router.put("/:id/assign", checkAuth, assignOrder);
Router.put("/:id", checkAuth, updateOrder);

export default Router;
