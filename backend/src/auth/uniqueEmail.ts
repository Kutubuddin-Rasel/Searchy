import { User } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getErrorMessage } from "../utils/getErrorMessage.js";

const uniqueEmail = asyncHandler(async (req,res) =>{
    const {email} = req.query

    if(!email){
        return res.status(400).json({ success: false, message: "Email is required" });
    }

    try {
        const exitingUser = await User.findOne({email})
        if(exitingUser){
            return res.status(400).json({
                success:false,
                message:"Email is already registered. Please login to your account"
            })
        }
        return res.status(200).json({
            success:true,
            message:"Email is available"
        })
    } catch (error) {
        const message = getErrorMessage(error);
        throw new ApiError(500,message);
    }
})

export default uniqueEmail