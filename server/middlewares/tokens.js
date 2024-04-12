import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const checkAuth = async (req, res, next) => {
  try {
    console.log("Checking the access token");
    const accessToken = req.headers.accesstoken.split(" ")[1];
    const refreshToken = req.headers.refreshtoken.split(" ")[1];
    console.log(accessToken);
    if (accessToken && refreshToken) {
      var decodedToken;
      try {
        decodedToken = jwt.decode(accessToken);
      } catch (err) {
        res.status(401).json({ message: "Invalid access token" });
      }
      console.log(decodedToken);
      console.log(Date.now() / 1000);
      if (decodedToken.exp <= Date.now() / 1000) {
        console.log("Access Token has expired!!,`Checking the refresh token!!");
        var decodedToken;
        try {
          decodedToken = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
          );
        } catch (err) {
          console.log(err.message);
          if (err.message === "jwt expired") {
            res
              .status(401)
              .json({
                message: "Refresh Token has expired. Please login again",
              });
            //decodedToken=jwt.decode(refreshToken);
          } else {
            res.status(401).json({ message: "Invalid refresh token" });
          }
        }
        if (decodedToken.exp <= Date.now() / 1000) {
          res
            .status(401)
            .json({ message: "Refresh Token has expired! Please login again" });
        }
        const user = await User.findOne({ email: decodedToken.email });
        console.log("User found!! adding to the req body");
        req.user = user;

        //generate new access token
        const newaccessToken = jwt.sign(
          { email: decodedToken.email },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "5m" }
        );
        req.body.newaccessToken = newaccessToken;
        next();
      } else {
        //console.log("Access Token has expired!!");
        const user = await User.findOne({ email: decodedToken.email });
        req.user = user;
        next();
      }
    } else {
      throw new Error("Invalid access token");
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
