import mongoose from "mongoose";
const variantSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
  },
  attributes: {
    color: String,
    size: String,
  },
  price: {
    type: Number,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  stockStatus: {
    type: String,
    enum: ["In Stock", "Out of Stock", "Low Stock"],
    default: "In Stock",
  },
});
const productsSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    categories: {
      type: [String],
      index: true,
    },
    images: {
      type: [String],
    },
    pricing: {
      regularPrice: {
        type: Number,
        required: true,
        min: 0,
      },
      salePrice: {
        type: Number,
        min: 0,
      },
      discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      currency: {
        type: String,
        default: "BDT",
      },
    },
    specifications: {
      brand: { type: String },
      model: { type: String },
      weight: { type: Number },
      dimensions: {
        length: { type: Number },
        width: { type: Number },
        height: { type: Number },
        unit: { type: String },
      },
    },
    variants: [variantSchema],
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    inCarts: {
      cartId: {
        type: mongoose.Schema.ObjectId,
        ref: "Cart",
      },
      quantity: {
        type: Number,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "draft"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true }
);

productsSchema.index({ category: 1, status: 1 });
productsSchema.index({ "pricing.regularPrice": 1, status: 1 });
productsSchema.index({ averageRating: -1 });
productsSchema.index({ title: "text", description: "text" });

productsSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLocaleLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  }
  next();
});

export const Product = mongoose.model("Product", productsSchema);
