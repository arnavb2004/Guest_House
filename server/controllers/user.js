import User from "./../models/User.js";

export const getUser = async (req, res) => {
  if (req.user.role !== "ADMIN" && req.user.id !== req.params.id) {
    return res
      .status(403)
      .json({ message: "You are not authorized to perform this action" });
  }
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  if (req.user.role !== "ADMIN") {
    return res
      .status(403)
      .json({ message: "You are not authorized to perform this action" });
  }
  console.log("Accessing all users...");
  try {
    const users = await User.find();
    //console.log(users)
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  if (req.user.role !== "ADMIN" && req.user.id !== req.params.id) {
    return res
      .status(403)
      .json({ message: "You are not authorized to perform this action" });
  }
  try {
    await User.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).json("Account has been updated");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    return res.status(200).json(req.user.notifications);
  }
  catch{
    return res.status(500).json({ message: err.message });
  }
}

export const deleteNotification = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.notifications = user.notifications.filter((notification) => notification._id.toString() !== req.params.id);
    await user.save();
    return res.status(200).json(user.notifications);
  }
  catch{
    return res.status(500).json({ message: err.message });
  }
}