import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import { checkAuth } from "./middlewares/tokens.js";
import reservationRoute from "./routes/reservationRoute.js";
import diningRoute from "./routes/diningRoute.js";
import utilsRoute from "./routes/utilsRoute.js";

import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";

dotenv.config();
const app = express();
const port = process.env.PORT || 4751;

// ✅ Proper CORS setup
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true, // Allow cookies and authentication headers
  })
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE,PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Disable console.log in production
// if (process.env.NODE_ENV === "production") {
//   console.log = () => {};
// }

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to database");

    // ✅ Initialize GridFsStorage *after* successful connection
    const storage = new GridFsStorage({ url: process.env.MONGO_URL });
    storage.on("connection", () => {});
    const upload = multer({ storage });

    // ✅ Start server only after DB connection is successful
    app.listen(port, () => {
      console.log(`Server is running at port ${port}`);
    });
  })
  .catch((err) => console.log("MongoDB Connection Error:", err));

// ✅ Routes
app.get("/", (req, res) => {
  console.log("Home route accessed");
  res.json({ message: "A simple API" });
});

app.use("/auth", authRoute);
app.use("/user", checkAuth, userRoute);
app.use("/dining", checkAuth, diningRoute);
app.use("/reservation", checkAuth, reservationRoute);
app.use("/utils", utilsRoute);

app.get("/protected", checkAuth, (req, res) => {
  console.log("Protected route accessed");
  res.json({
    message: "Protected route",
    user: req.body.user,
    accessToken: req.body.newaccessToken,
  });
});