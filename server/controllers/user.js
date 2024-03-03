import OTP from "./../models/otpModel.js";
import User from "./../models/userModel.js";
import jwt from "jsonwebtoken";

export const getUser = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email cannot be empty" });

  try {
    const user = await User.findOne({ email });
    if (user) {
      const refreshToken = jwt.sign(
        { email },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "180d",
        }
      );
      const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "5m",
      });
      user.refreshToken = refreshToken;
      await user.save();
     
      res.status(200).json({ user, refreshToken, accessToken });
    } else {
      res.status(200).json({ message: "User does not exist" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
