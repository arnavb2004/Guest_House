import Meal from "../models/mealModel.js";


export async function createOrder(req, res) {
  try {

    const email = req.body.user.email;
    const { items } = req.body;
    let amount = 0;
    for (let i = 0; i < items.length; i++) {
      amount += items[i].price;
    }
    const meal = new Meal({
      email,
      items,
      amount
    });
    await meal.save();
    res.status(200).json({ message: "Order created successfully" });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getOrders(req, res) {
  try {
    const user = req.body.user;

    if(user.role !== 'ADMIN') {
      return res.status(400).json({ message: "Access denied" });
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
      req.body.user.email !== order.email &&
      req.body.user.role !== "ADMIN"
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

