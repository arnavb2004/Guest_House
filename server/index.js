import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";


import authRoute from "./routes/authRoute.js";

const app = express();
const port = process.env.PORT || 6969;

app.use(cors());
app.use(express.json());
dotenv.config();

app.get("/", (req, res) => {
  res.json({
    message: "A simple API",
  });
});

app.use("/auth", authRoute);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to database");
    app.listen(port, () => {
      console.log(`Server is runnning at port ${port}`);
    });
  })
  .catch((err) => console.log(err));
