import  jwt  from "jsonwebtoken";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getErrorMessage } from "../utils/getErrorMessage.js";
import { User } from "../models/user.model.js";
import type { Types } from "mongoose";

interface tokenPayload{
    _id: Types.ObjectId;
    fullName: string;
    email: string;
}

const verifyJWT = asyncHandler(async (req,_,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        if(!token){
            throw new ApiError(401,"Unauthorized token");
        }
        const decodeToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET as string) as tokenPayload;

        const user = await User.findById(decodeToken?._id)

        if(!user){
            throw new ApiError(401,"Invalid access token")
        }
        req.user = user;
        next();

    } catch (error) {
        const message = getErrorMessage(error);
        throw new ApiError(401,message)
    }
})

export default verifyJWT