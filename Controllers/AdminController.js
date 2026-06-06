const Admin = require("../Models/AdminModel");
const User = require("../Models/UserModel");
const Seller = require("../Models/SellerModel");
const Contact = require("../Models/ContactModel");
const Adoption = require("../Models/AdoptionModel");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../Utils/jwt");

// POST /api/admin/login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken({ id: admin._id, email: admin.email, role: "admin" });
    res.status(200).json({ message: "Admin login successful", token, admin: { id: admin._id, name: admin.name, email: admin.email } });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// POST /api/admin/register  (one-time setup to create admin)
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existing = await Admin.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: "Admin registered successfully", admin: { id: admin._id, name, email } });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// GET /api/admin/dashboard
const getDashboard = async (req, res) => {
  try {
    const [totalUsers, totalSellers, totalAdoptions, totalMessages] = await Promise.all([
      User.countDocuments(),
      Seller.countDocuments(),
      Adoption.countDocuments(),
      Contact.countDocuments(),
    ]);

    const pendingAdoptions  = await Adoption.countDocuments({ status: "Pending" });
    const approvedAdoptions = await Adoption.countDocuments({ status: "Approved" });
    const rejectedAdoptions = await Adoption.countDocuments({ status: "Rejected" });

    res.status(200).json({
      message: "Dashboard statistics",
      stats: {
        totalUsers,
        totalSellers,
        totalAdoptions,
        totalMessages,
        adoptionStatus: { pendingAdoptions, approvedAdoptions, rejectedAdoptions },
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load dashboard", error: error.message });
  }
};

module.exports = { loginAdmin, registerAdmin, getDashboard };
