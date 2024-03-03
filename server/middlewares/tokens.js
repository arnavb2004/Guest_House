import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const checkAuth = async (req, res, next) => {
    console.log("here: ",req.body)
  try {
    console.log("Checking the access token");
    const authHeader = req.headers.authorization;
    //only the access token is sent to the user
    console.log(authHeader);
    if (authHeader && authHeader.split(" ")[0] === "Bearer") {
      const token = authHeader.split(" ")[1];
      console.log(token);
      var decodedToken;
      try {
        decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      } catch (err) {
        if (err.message === "jwt expired") {
          decodedToken = jwt.decode(token);
        } else {
          throw new Error("Invalid access token");
        }
      }
      console.log(decodedToken);
      console.log(Date.now() / 1000);
      if (decodedToken.exp <= Date.now() / 1000) {
        console.log("Access Token has expired!!,Checking the refresh token!!");
        const user = await User.findOne({ email: decodedToken.email });
        if (!user || !user.refreshToken) {
          throw new Error("User not found");
        }
        jwt.verify(
          user.refreshToken,
          process.env.REFRESH_TOKEN_SECRET,
          (err, decoded) => {
            if (err) {
              throw new Error("Invalid refresh token");
            }
            console.log("Refresh Token is valid!!");
            const accessToken = jwt.sign(
              { email: decoded.email },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: "5m" }
            );
            res.setHeader("Authorization", `Bearer ${accessToken}`);
            req.body.user = user;
            //res.status(200).json({accessToken});
            next();
          }
        );
      } else {
        //console.log("Access Token has expired!!");
        const user = await User.findOne({ email: decodedToken.email });
        req.body.user = user;
        next();
      }
    } else {
      throw new Error("Invalid access token");
    }
  } catch (error) {
    // if(error.message==="jwt expired"){

    // }
    res.status(401).json({ message: error.message });
  }
};
