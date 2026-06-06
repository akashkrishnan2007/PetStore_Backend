const mongoose = require("mongoose");

const SellerSchema = new mongoose.Schema(
  {
    name:      { type: String, required: true, trim: true },
    email:     { type: String, required: true, unique: true, lowercase: true },
    phone:     { type: String, required: true },
    password:  { type: String, required: true },
    shopName:  { type: String, required: true, trim: true },
    shopAddress:{ type: String, required: true },
    category:  { type: String, default: "General" }, // e.g. Dogs, Cats, Birds
  },
  { timestamps: true }
);

module.exports = mongoose.model("Seller", SellerSchema);
