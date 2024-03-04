import User from "../models/userModel.js";
import Reservation from "../models/reservationModel.js";
import express from "express";
const Router=express.Router()
import {checkAuth} from "../middlewares/tokens.js"
import {getUser} from "../controllers/user.js"

Router.get("/allusers",checkAuth, async (req,res)=>{
    if(req.body.user.role!=='ADMIN'){
        return res.status(403).json({message:"You are not authorized to perform this action"})
    }
    console.log("Accessing all users...")
    try{
        const users=await User.find()
        //console.log(users)
        return res.status(200).json(users)
    }catch(err){
        return res.status(500).json({message:err.message})
    }
})

Router.get("/user/:id",checkAuth, async (req,res)=>{
    if(req.body.user.role!=='ADMIN'){
        return res.status(403).json({message:"You are not authorized to perform this action"})
    }
    try{
        const user=await User.findById(req.params.id)
        const reservations=await Reservation.find({guestEmail:user.email})
        res.json(user,reservations)
    }catch(err){
        res.status(500).json({message:err.message})
    }
})

Router.get("/reservations",checkAuth, async (req,res)=>{
    if(req.body.user.role!=='ADMIN'){
        return res.status(403).json({message:"You are not authorized to perform this action"})
    }
    try{
        //need to extract the sort field from the query parameters sent in the request
        const sortField=req.query.sortField//this will be either 'createdAt' or 'arrivalDate'
        //or updatedAt
        const filters=req.query.filters
        const reservations=await Reservation.find().sort({[sortField]:-1})//.where(filters)
        res.json(reservations)
    }catch(err){
        res.status(500).json({message:err.message})
    }
})

Router.get("/reservations/:id",checkAuth, async (req,res)=>{
    if(req.body.user.role!=='ADMIN'){
        return res.status(403).json({message:"You are not authorized to perform this action"})
    }
    try{
        const reservation=await Reservation.findById(req.params.id)
        res.status(200).json(reservation)
    }catch(err){
        res.status(500).json({message:err.message})
    }
})

export default Router

