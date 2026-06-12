const User = require("../Models/UserModel");
const Seller = require("../Models/SellerModel");
const Contact = require("../Models/ContactModel");
const Adoption = require("../Models/AdoptionModel");
const { generateToken } = require("../Utils/jwt");

const ADMIN_EMAIL    = "admin@petzone.com";
const ADMIN_PASSWORD = "Admin123";

// POST /api/admin/login
const loginAdmin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD)
    return res.status(401).json({ message: "Invalid Admin Credentials" });

  const token = generateToken({ email: ADMIN_EMAIL, role: "admin" });
  res.status(200).json({ message: "Admin login successful", token, admin: { name: "Admin", email: ADMIN_EMAIL } });
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

module.exports = { loginAdmin, getDashboard };
