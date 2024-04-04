import Meal from "../models/Meal.js";
import User from "../models/User.js";

export async function createOrder(req, res) {
  try {
    const email = req.user.email;
    const { items } = req.body;
    let amount = 0;
    for (let i = 0; i < items.length; i++) {
      amount += items[i].price * items[i].quantity;
    }
    const meal = new Meal({
      email,
      items,
      amount,
      reviewers: [{ role: "ADMIN", status: "PENDING", comments: "" }],
    });
    await meal.save();
    res.status(200).json({ message: "Order created successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getOrders(req, res) {
  try {
    const user = req.user;

    if (user.role !== "ADMIN") {
      const orders = await Meal.find({ email: user.email });
      return res.status(200).json(orders);
    }
    const orders = await Meal.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getOrder(req, res) {
  try {
    const order = await Meal.findById(req.params.id);
    if (
      req.user.email != order.email &&
      req.user.role !== "ADMIN" &&
      !order.reviewers.find((r) => r.role === req.user.role)
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to view this application" });
    }
    res.status(200).json({ order });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const updateOrderStatus = (order) => {
  let reviewers = order.reviewers;

  let isApproved = true;
  let isRejected = false;
  let adminStatus;
  reviewers.forEach((reviewer) => {
    if (reviewer.role === "ADMIN") {
      adminStatus = reviewer.status;
    } else {
      if (reviewer.status !== "APPROVED") {
        isApproved = false;
      }
      if (reviewer.status === "REJECTED") {
        isRejected = true;
      }
    }
  });

  if (adminStatus === "APPROVED") {
    order.status = "APPROVED";
  } else if (adminStatus === "REJECTED") {
    order.status = "REJECTED";
  } else if (isApproved) {
    order.status = "APPROVED";
  } else if (isRejected) {
    order.status = "REJECTED";
  } else {
    order.status = "PENDING";
  }
  return order;
};

export const getPendingOrders = async (req, res) => {
  console.log("Getting pending orders...");
  try {
    if (req.user.role === "USER") {
      const orders = await Meal.find({
        email: req.user.email,
        status: "PENDING",
      }).sort({
        createdAt: -1,
      });
      return res.status(200).json(orders);
    } else if (req.user.role === "ADMIN") {
      const orders = await Meal.find({
        status: "PENDING",
      }).sort({
        createdAt: -1,
      });
      res.status(200).json(orders);
    } else {
      const orders = await Meal.find({
        reviewers: {
          $elemMatch: {
            role: req.user.role,
            status: "PENDING",
          },
        },
      }).sort({
        createdAt: -1,
      });
      res.status(200).json(orders);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getApprovedOrders = async (req, res) => {
  console.log("Getting approved orders...");
  try {
    if (req.user.role === "USER") {
      const orders = await Meal.find({
        email: req.user.email,
        status: "APPROVED",
      }).sort({
        createdAt: -1,
      });
      return res.status(200).json(orders);
    } else if (req.user.role === "ADMIN") {
      const orders = await Meal.find({
        status: "APPROVED",
      }).sort({
        createdAt: -1,
      });
      res.status(200).json(orders);
    } else {
      const orders = await Meal.find({
        reviewers: {
          $elemMatch: {
            role: req.user.role,
            status: "APPROVED",
          },
        },
      }).sort({
        createdAt: -1,
      });
      res.status(200).json(orders);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRejectedOrders = async (req, res) => {
  console.log("Getting rejected orders...");
  try {
    if (req.user.role === "USER") {
      const orders = await Meal.find({
        email: req.user.email,
        status: "REJECTED",
      }).sort({
        createdAt: -1,
      });
      return res.status(200).json(orders);
    } else if (req.user.role === "ADMIN") {
      const orders = await Meal.find({
        status: "REJECTED",
      }).sort({
        createdAt: -1,
      });
      res.status(200).json(orders);
    } else {
      const orders = await Meal.find({
        reviewers: {
          $elemMatch: {
            role: req.user.role,
            status: "REJECTED",
          },
        },
      }).sort({
        createdAt: -1,
      });
      res.status(200).json(orders);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export async function approveOrder(req, res) {
  try {
    let order = await Meal.findById(req.params.id);
    if (
      req.user.role !== "ADMIN" &&
      !order.reviewers.find((r) => r.role === req.user.role)
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }

    order.reviewers = order.reviewers.map((reviewer) => {
      if (reviewer.role === req.user.role) {
        reviewer.status = "APPROVED";
        if (req.body.comments) reviewer.comments = req.body.comments;
      }
      return reviewer;
    });
    let initStatus = order.status;
    order = updateOrderStatus(order);
    console.log(order);
    //add the message to the user model of who made the order
    if (initStatus !== order.status) {
      console.log(order.email);
      const resUser = await User.findOne({ email: order.email });
      console.log(resUser);
      if (resUser.notifications == null) {
        // console.log()
        resUser.notifications = [];
      }
      // console.log(resUser.notifications)
      resUser.notifications.push({
        message: `Order status changed to ${order.status} - ${
          req.body.comments || "No comments"
        }`,
        sender: req.user.role,
        res_id: order._id,
      });
      await resUser.save();
    }

    await order.save();
    res.status(200).json({ message: "Order Approved" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function rejectOrder(req, res) {
  try {
    let order = await Meal.findById(req.params.id);
    if (
      req.user.role !== "ADMIN" &&
      !order.reviewers.find((r) => r.role === req.user.role)
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }
    order.reviewers = order.reviewers.map((reviewer) => {
      if (reviewer.role === req.user.role) {
        reviewer.status = "REJECTED";
        if (req.body.comments) reviewer.comments = req.body.comments;
      }
      return reviewer;
    });
    let initStatus = order.status;
    order = updateOrderStatus(order);
    if (initStatus !== order.status) {
      const resUser = await User.findOne({ email: order.email });
      if (resUser.notifications == null) {
        // console.log()
        resUser.notifications = [];
      }
      resUser.notifications.push({
        message: `Order Status changed to ${order.status} - ${
          req.body.comments || "No comments"
        }`,
        sender: req.user.role,
        res_id: order._id,
      });
      await resUser.save();
    }
    await order.save();
    res.status(200).json({ message: "Order Rejected" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function holdOrder(req, res) {
  try {
    let order = await Meal.findById(req.params.id);
    if (
      req.user.role !== "ADMIN" &&
      !order.reviewers.find((r) => r.role === req.user.role)
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }
    order.reviewers = order.reviewers.map((reviewer) => {
      if (reviewer.role === req.user.role) {
        reviewer.status = "HOLD";
        if (req.body.comments) reviewer.comments = req.body.comments;
      }
      return reviewer;
    });
    let initStatus = order.status;
    order = updateOrderStatus(order);
    if (initStatus !== order.status) {
      const resUser = await User.findOne({ email: order.email });
      if (resUser.notifications == null) {
        resUser.notifications = [];
      }
      resUser.notifications.push({
        message: `Order Status changed to ${order.status} - ${
          req.body.comments || "No comments"
        }`,
        sender: req.user.role,
        res_id: order._id,
      });
      await resUser.save();
    }

    await order.save();
    res.status(200).json({ message: "Order on hold" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function updateOrder(req, res) {
  try {
    if (req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }
    await Meal.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({ message: "Order updated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function assignOrder(req, res) {
  try {
    if (req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }
    const order = await Meal.findById(req.params.id);
    order.reviewers = req.body.reviewers.map((r) => ({
      role: r,
      status: "PENDING",
      comments: "",
    }));
    await order.save();
    res.status(200).json({ message: "Order Assigned" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
