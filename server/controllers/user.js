import OTP from "./../models/otpModel.js";
import User from "./../models/userModel.js";


export const getUser = async(req, res) => {

    const { email } = req.body;

    if(!email) return res.status(400).json({message:"Email cannot be empty"});

    try {
        const user = await User.findOne({email});
        if(user){
            res.status(200).json({user});
        }else{
            res.status(200).json({message:"User does not exist"});
        }
        
    } catch (error) {
        res.status(400).json({message:error.message});        
    }



}