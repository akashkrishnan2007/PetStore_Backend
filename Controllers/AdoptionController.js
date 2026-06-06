const Adoption = require("../Models/AdoptionModel");
const { isValidEmail, isValidPhone } = require("../Utils/validation");

// POST /api/adoption
const createAdoption = async (req, res) => {
  try {
    const { petName, petType, petAge, petBreed, description, applicantName, applicantEmail, applicantPhone, address } = req.body;

    if (!petName || !petType || !petAge || !applicantName || !applicantEmail || !applicantPhone || !address)
      return res.status(400).json({ message: "All required fields must be filled" });

    if (!isValidEmail(applicantEmail))
      return res.status(400).json({ message: "Invalid email format" });

    if (!isValidPhone(applicantPhone))
      return res.status(400).json({ message: "Phone must be 10 digits" });

    const adoption = await Adoption.create({
      petName, petType, petAge, petBreed, description,
      applicantName, applicantEmail, applicantPhone, address,
    });
    res.status(201).json({ message: "Adoption request submitted", adoption });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit adoption request", error: error.message });
  }
};

// GET /api/adoption
const getAllAdoptions = async (req, res) => {
  try {
    const adoptions = await Adoption.find().sort({ createdAt: -1 });
    res.status(200).json({ total: adoptions.length, adoptions });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch adoptions", error: error.message });
  }
};

// PUT /api/adoption/:id/approve
const approveAdoption = async (req, res) => {
  try {
    const adoption = await Adoption.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" },
      { new: true }
    );
    if (!adoption)
      return res.status(404).json({ message: "Adoption request not found" });
    res.status(200).json({ message: "Adoption approved", adoption });
  } catch (error) {
    res.status(500).json({ message: "Failed to approve adoption", error: error.message });
  }
};

// PUT /api/adoption/:id/reject
const rejectAdoption = async (req, res) => {
  try {
    const adoption = await Adoption.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" },
      { new: true }
    );
    if (!adoption)
      return res.status(404).json({ message: "Adoption request not found" });
    res.status(200).json({ message: "Adoption rejected", adoption });
  } catch (error) {
    res.status(500).json({ message: "Failed to reject adoption", error: error.message });
  }
};

module.exports = { createAdoption, getAllAdoptions, approveAdoption, rejectAdoption };
