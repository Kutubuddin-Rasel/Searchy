import mongoose, { Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({path:"./.env"});

interface IAddress{
  street?: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
  country: string;
}
export interface IUser {
  email: string;
  password: string;
  fullName: string;
  avatar?: string;
  avatarPath?: string;
  phoneNumber?: string;
  address: IAddress[];
  role: roles;
  refreshToken?: string;
}
export interface IUserMethods {
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export type UserDocument = Document & IUser & IAddress
export type UserModel = Model<IUser,{},IUserMethods>

const addressSchema = new mongoose.Schema({
  street: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  isDefault: {
    type: Boolean,
  },
  country: {
    type: String,
    required: true,
    default: "Bangladesh",
  },
});
export enum roles {
  Admin = "admin",
  Customer = "customer",
}
const userSchema = new mongoose.Schema<IUser,UserModel,IUserMethods>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is requried"],
      minlength: 8,
      select: false,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
    },
    avatarPath:{
      type:String,
    },
    phoneNumber: {
      type: String,
    },
    address: {
      type: [addressSchema],
    },
    role: {
      type: String,
      enum: Object.values(roles),
      default: roles.Customer,
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.isPasswordCorrect = async function (password: string):Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function ():string {
  return jwt.sign(
    {
      _id: this._id,
      fullName: this.fullName,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY as any,
    }
  );
};
userSchema.methods.generateRefreshToken = function ():string {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY as any,
    }
  );
};

export const User = mongoose.model<IUser,UserModel>("User", userSchema);
