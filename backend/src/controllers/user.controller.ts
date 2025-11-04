import type { Types } from "mongoose";
import { User } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadToSupabase } from "../utils/uploadToSupabase.js";
import { getErrorMessage } from "../utils/getErrorMessage.js";

interface generatetokens{
    accessToken:string,
    refreshToken:string
}
const generateAccessRefreshToken = async (userId:Types.ObjectId):Promise<generatetokens>=>{
    try {
        const user = await User.findById(userId);
        if(!user){
            throw new ApiError(404,"User not found")
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
            
        user.refreshToken =refreshToken;

        await user.save({validateBeforeSave:false});
        return {accessToken,refreshToken}

    } catch (error) {
        console.log("Error while generating access and refresh token",error);
        throw new ApiError(500,"Something went wrong while generating refresh and access token")
    }
} 

const options={
    httpOnly:true,
    secure:true
}
const registerUser = asyncHandler(async(req,res) =>{
    const {fullName,email,password} = req.body;

    if(
        [fullName,email,password].some((field)=> field?.trim() === "")
    ){
        throw new ApiError(400,"Field is compulsary");
    }

    try {
        const existedUser = await User.findOne({email})
        if(existedUser){
            throw new ApiError(409,"User with email is already existed")
        }
    
        const avatarLocalPath = (req.file as Express.Multer.File| undefined)?.path;
        console.log(avatarLocalPath);
    
        if(!avatarLocalPath){
            throw new ApiError(400,"Avatar is required")
        }
    
        const avatar = await uploadToSupabase(avatarLocalPath,"avatar","users");
    
        if(!avatar){
            throw new ApiError(400,"Field is compulsary");
        }
    
        const user = await User.create({
            email,
            password,
            fullName,
            role:'customer',
            avatar:avatar.publicUrl,
            avatarPath:avatar.path,
    
        })
        const createdUser = await User.findById(user._id);
    
        if(!createdUser){
            throw new ApiError(500,"Server Error");
        }
    
        return res.status(201).json(
            new ApiResponse(200,createdUser,"User registerd successfully")
        )
    } catch (error) {
        const message = getErrorMessage(error);
        throw new ApiError(400,message)
    }
})

const loginUser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body

    if(!email){
        throw new ApiError(400,"email is required");
    }
    try {
        const user = await User.findOne({email}).select("+password")
    
        if(!user){
            throw new ApiError(404,"User not found");
        }
    
        const isPasswordValid = await user.isPasswordCorrect(password)
    
        if(!isPasswordValid){
            throw new ApiError(401,"Invalid password");
        }
    
        const {accessToken,refreshToken} = await generateAccessRefreshToken(user._id);
    
        const loggedUser = await User.findById(user._id);
    
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(
            new ApiResponse(200,
                {user:loggedUser,accessToken,refreshToken}
                ,"User logged in successfully"
            )
        )
    } catch (error) {
        const message = getErrorMessage(error);
        throw new ApiError(401,message)
    }
})

const logOut = asyncHandler(async (req,res) =>{
    try {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {refreshToken:null}
            },
            {new:true}
        ).exec()
        
        return res
        .status(200)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken",options)
        .json(new ApiResponse(200,{},"User logged out"))
    } catch (error) {
        const message = getErrorMessage(error);
        throw new ApiError(500,message)
    }
})

export {registerUser,loginUser,logOut}