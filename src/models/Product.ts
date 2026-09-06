import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  subtitle: { type: String, default: "" },
  price: { type: Number, required: true },
  priceFormatted: { type: String, required: true },
  rating: { type: Number, default: 5.0 },
  reviewCount: { type: Number, default: 0 },
  material: { type: String, default: "" },
  lining: { type: String, default: "" },
  mechanism: { type: String, default: "" },
  packaging: { type: String, default: "" },
  description: { type: String, default: "" },
  features: [{ type: String }],
  sizes: [{ type: String }],
  colorName: { type: String, default: "" },
  colorHex: { type: String, default: "#0A0A0A" },
  bgColor: { type: String, default: "onyx" },
  images: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Product = models.Product || model("Product", ProductSchema);
export default Product;
