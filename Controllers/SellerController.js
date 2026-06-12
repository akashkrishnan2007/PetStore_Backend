const Seller = require("../Models/SellerModel");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../Utils/jwt");
const { isValidEmail, isValidPhone, isValidPassword } = require("../Utils/validation");

// POST /api/sellers/register
const registerSeller = async (req, res) => {
  try {
    const { name, email, phone, password, shopName, shopAddress, category } = req.body;

    if (!name || !email || !phone || !password || !shopName || !shopAddress)
      return res.status(400).json({ message: "All fields are required" });

    if (!isValidEmail(email))
      return res.status(400).json({ message: "Invalid email format" });

    if (!isValidPhone(phone))
      return res.status(400).json({ message: "Phone must be 10 digits" });

    if (!isValidPassword(password))
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const existing = await Seller.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const seller = await Seller.create({ name, email, phone, password: hashedPassword, shopName, shopAddress, category });

    const token = generateToken({ id: seller._id, email: seller.email, role: "seller" });
    res.status(201).json({ message: "Seller registered successfully", token, seller: { id: seller._id, name, shopName, email } });
  } catch (error) {
    if (error.code === 11000)
      return res.status(409).json({ message: "Email already registered" });
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// POST /api/sellers/login
const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const seller = await Seller.findOne({ email });
    if (!seller)
      return res.status(404).json({ message: "Seller not found" });

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken({ id: seller._id, email: seller.email, role: "seller" });
    res.status(200).json({ message: "Login successful", token, seller: { id: seller._id, name: seller.name, shopName: seller.shopName } });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// GET /api/sellers
const getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find().select("-password");
    res.status(200).json({ total: sellers.length, sellers });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch sellers", error: error.message });
  }
};

// GET /api/sellers/:id
const getSellerById = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id).select("-password");
    if (!seller)
      return res.status(404).json({ message: "Seller not found" });
    res.status(200).json({ seller });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch seller", error: error.message });
  }
};

module.exports = { registerSeller, loginSeller, getAllSellers, getSellerById };
