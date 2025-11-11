import type { Types } from "mongoose";
import { User } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadToSupabase } from "../utils/uploadToSupabase.js";
import { accessTokenOptions, refreshTokenOptions } from "../utils/cookieOptions.js";
import jwt from "jsonwebtoken"
import { junit } from "node:test/reporters";

interface generatetokens {
  accessToken: string;
  refreshToken: string;
}
const generateAccessRefreshToken = async (
  userId: Types.ObjectId
): Promise<generatetokens> => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Error while generating access and refresh token", error);
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  if ([fullName, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Field is compulsary");
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User with email is already existed");
  }

  const avatarLocalPath = (req.file as Express.Multer.File | undefined)?.path;
  console.log(avatarLocalPath);

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadToSupabase(avatarLocalPath, "avatar", "users");

  if (!avatar) {
    throw new ApiError(400, "Field is compulsary");
  }

  const user = await User.create({
    email,
    password,
    fullName,
    role: "customer",
    avatar: avatar.publicUrl,
    avatarPath: avatar.path,
  });
  const createdUser = await User.findById(user._id);

  if (!createdUser) {
    throw new ApiError(500, "Server Error");
  }

  const { accessToken, refreshToken } = await generateAccessRefreshToken(
    user._id
  );
  return res
    .status(201)
    .cookie("accessToken", accessToken, accessTokenOptions)
    .cookie("refreshToken", refreshToken, refreshTokenOptions)
    .json(ApiResponse.created(createdUser, "User registerd successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "email is required");
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessRefreshToken(
    user._id
  );

  const loggedUser = await User.findById(user._id);

  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenOptions)
    .cookie("refreshToken", refreshToken, refreshTokenOptions)
    .json(
      ApiResponse.ok(
        { user: loggedUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

const logOut = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: null },
    },
    { new: true }
  ).exec();

  return res
    .status(200)
    .clearCookie("accessToken", accessTokenOptions)
    .clearCookie("refreshToken", refreshTokenOptions)
    .json(ApiResponse.ok({}, "User logged out"));
});

interface refreshTokenPayload{
  _id:string
}

const refreshToken = asyncHandler(async (req,res)=>{
  const incomingRefreshToken = req.cookies.refreshToken
  if(!incomingRefreshToken){
    throw new ApiError(401,"Unauthorized request")
  }

  const decodeRefreshToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET as string) as refreshTokenPayload

  const user = await User.findById(decodeRefreshToken._id)

  if(!user){
    throw new ApiError(401,"Invalid refresh token")
  }

  if(incomingRefreshToken != user?.refreshToken){
    throw new ApiError(401,"Refresh token is expired or used")
  }

  const {accessToken,refreshToken} = await generateAccessRefreshToken(user._id)
  
  return res
  .status(200)
  .cookie("accessToken",accessToken,accessTokenOptions)
  .cookie("refreshToken",refreshToken,refreshTokenOptions)
  .json(
    new ApiResponse(
      200,
      {accessToken,refreshToken},
      "Access token refreshed"
    )
  )
});

export { registerUser, loginUser, logOut, refreshToken };

