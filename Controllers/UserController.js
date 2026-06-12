const User = require("../Models/UserModel");
const bcrypt = require("bcryptjs");
const { generateToken, verifyToken } = require("../Utils/jwt");
const { isValidEmail, isValidPhone, isValidPassword } = require("../Utils/validation");

// POST /api/users/register
const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email, phone, password } = req.body;

    if (!firstname || !lastname || !email || !phone || !password)
      return res.status(400).json({ message: "All fields are required" });

    if (!isValidEmail(email))
      return res.status(400).json({ message: "Invalid email format" });

    if (!isValidPhone(phone))
      return res.status(400).json({ message: "Phone must be 10 digits" });

    if (!isValidPassword(password))
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ firstname, lastname, email, phone, password: hashedPassword });

    const token = generateToken({ id: user._id, email: user.email });
    res.status(201).json({ message: "User registered successfully", token, user: { id: user._id, firstname, lastname, email } });
  } catch (error) {
    if (error.code === 11000)
      return res.status(409).json({ message: "Email already registered" });
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// POST /api/users/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken({ id: user._id, email: user.email });
    res.status(200).json({ message: "Login successful", token, user: { id: user._id, firstname: user.firstname, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// GET /api/users/profile  (requires Authorization: Bearer <token>)
const getUserProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "No token provided" });

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token", error: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
