const mongoose = require("mongoose");

const AdoptionSchema = new mongoose.Schema(
  {
    petName:      { type: String, required: true, trim: true },
    petType:      { type: String, required: true }, // Dog, Cat, Bird, etc.
    petAge:       { type: String, required: true },
    petBreed:     { type: String },
    description:  { type: String },
    // Person requesting adoption
    applicantName:  { type: String, required: true },
    applicantEmail: { type: String, required: true, lowercase: true },
    applicantPhone: { type: String, required: true },
    address:        { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Adoption", AdoptionSchema);
