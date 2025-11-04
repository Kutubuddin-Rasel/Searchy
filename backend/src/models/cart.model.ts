import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "expired", "completed", "abandoned"],
      default: "active",
      index:true
    },
    items: [
      {
        productID: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        },
        sku: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        image: {
          type: String,
        },
      },
    ],
    subtotal: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      default: 0,
      min: 0,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      index: { expires: "7d" },
    },
    modifiedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

cartSchema.pre('save',function(next){
    this.modifiedAt = new Date();
    next();
})

cartSchema.pre('save',function(next){
    if(this.items && this.items.length>0){
        this.subtotal = this.items.reduce((sum,item)=>{
            return sum + (item.price * item.quantity);
        },0);
        this.total = this.subtotal;
    }
    next();
})

cartSchema.index({userId:1, status:1})
export const Cart = mongoose.model("Cart", cartSchema);
