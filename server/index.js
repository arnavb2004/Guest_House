import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import {expressjwt} from 'express-jwt';
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import {checkAuth} from "./middlewares/tokens.js";
import Reservation from "./models/reservationModel.js";
const app = express();
const port = process.env.PORT || 4751;

app.use(cors());
app.use(express.json());
dotenv.config();

app.get("/", (req, res) => {
  res.json({
    message: "A simple API",
  });
});

//app.use(expressjwt({ secret: process.env.ACCESS_TOKEN_SECRET, algorithms: ['HS256'] }).unless({ path: ["/auth/login", "/auth/register"] }));
app.use("/auth", authRoute);
app.use('/user',userRoute);

app.get("/protected",checkAuth, (req, res) => {
  res.json({
    message: "Protected route",
    user:req.body.user
  });
});



app.post('/reservation',async (req,res)=>{

  try {
    console.log(req.body)
    await Reservation.create(req.body);
  
    res.status(200).json({message:"Reservation Request added successfully"})
    
  } catch (error) {

    res.status(400).json({message:error.message})

  }
  
})

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to database");
    app.listen(port, () => {
      console.log(`Server is runnning at port ${port}`);
    });
  })
  .catch((err) => console.log(err));
