import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const checkAuth = async (req, res, next) => {
    try{
        console.log("Checking the access token")
        const temp=req.headers;
        //console.log(temp)
        const accessToken=req.headers.accesstoken.split(" ")[0];
        const refreshToken=req.headers.refreshtoken.split(" ")[0];
        //only the access token is sent to the user
        console.log(accessToken)
        if(accessToken && refreshToken){
        // const accessToken=accessToken.split(" ")[1];
        // const refreshToken=refreshToken.split(" ")[1];
        //console.log(accessToken)
        var decodedToken;
        try{
        decodedToken=jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);
        }
        catch(err){
            if(err.message==="jwt expired"){
                decodedToken=jwt.decode(accessToken);
            }
            else{
                //console.log(err)
                console.log("Here!!")
                throw new Error("Invalid access token");
            }
        }
        console.log(decodedToken)
        console.log(Date.now()/1000)
        if(decodedToken.exp <= Date.now()/1000){
            console.log("Access Token has expired!!,Checking the refresh token!!")
            var decodedToken;
            try{
            decodedToken=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)//,(err,decoded)=>{console.log(err)});
            }
            catch(err){
                if(err.message==="jwt expired"){
                    throw new Error("Refresh Token has expired!Please login again");
                    //decodedToken=jwt.decode(refreshToken);
                }
                else{
                    throw new Error("Invalid refresh token");
                }
            }
            if(decodedToken.exp <= Date.now()/1000){
                throw new Error("Refresh Token has expired!Please login again");
            }
            //const user=await User.findOne({email:decodedToken.email});
            // if(!user || !user.refreshToken){
            //     throw new Error("User not found");
            // }
            const user=await User.findOne({email:decodedToken.email});
            req.body.user=user;
            //generate new access token
            const newaccessToken=jwt.sign({email:decodedToken.email},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"5m"});
            req.body.newaccessToken=newaccessToken;
            // req.body.refreshToken=refreshToken;
            // res.json({accessToken:newaccessToken,refreshToken:refreshToken});
            next();
            // jwt.verify(user.refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,decoded)=>{
            //     if(err){
            //         throw new Error("Invalid refresh token");
            //     }
            //     console.log("Refresh Token is valid!!")
            //     const accessToken=jwt.sign({email:decoded.email},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"5m"});
            //     res.setHeader("Authorization",`Bearer ${accessToken}`);
            //     req.body.user=user;
            //     //res.status(200).json({accessToken});
            //     next();
            // });    
        }
        else{
            //console.log("Access Token has expired!!");
            const user=await User.findOne({email:decodedToken.email});
            req.body.user=user;
            next();
        }
        }
        else{
            throw new Error("Invalid access token");
        }
    }
    catch(error){
        // if(error.message==="jwt expired"){
        // }
        res.status(401).json({message:error.message});
    }    
};