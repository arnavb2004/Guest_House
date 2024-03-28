import Meal from "../models/Meal.js";

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
    if (req.user.email !== order.email && req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "You are not authorized to view this application" });
    }
    res.status(200).json({ order });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
