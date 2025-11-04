import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    index: true   
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true   
  },
  userName: {
    type: String,         
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  title: {
    type: String,
    trim: true,
    maxlength: 100
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  verified: {
    type: Boolean,          
    default: false,
    index: true
  },
  helpful: {
    type: Number,           
    default: 0,
    min: 0
  },
  reported: {
    type: Boolean, 
    default: false
  }
}, { timestamps: true });

reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });
reviewSchema.index({ productId: 1, rating: -1, createdAt: -1 });

export const Review = mongoose.model("Review", reviewSchema);
