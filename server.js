const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./Utils/db");
const bcrypt = require("bcryptjs");
const Admin = require("./Models/AdminModel");

// Route imports
const userRoutes     = require("./Routers/UserRoutes");
const sellerRoutes   = require("./Routers/SellerRoutes");
const contactRoutes  = require("./Routers/ContactRoutes");
const adoptionRoutes = require("./Routers/AdoptionRoutes");
const adminRoutes    = require("./Routers/AdminRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users",    userRoutes);
app.use("/api/sellers",  sellerRoutes);
app.use("/api/contact",  contactRoutes);
app.use("/api/adoption", adoptionRoutes);
app.use("/api/admin",    adminRoutes);

// Health check
app.get("/", (req, res) => res.send("PetZone API is running..."));

// Auto-seed admin on startup
const seedAdmin = async () => {
  const existing = await Admin.findOne({ email: "admin@petzone.com" });
  if (!existing) {
    const hashed = await bcrypt.hash("Admin123", 10);
    await Admin.create({ name: "Admin", email: "admin@petzone.com", password: hashed });
    console.log("[SEED] Admin created: admin@petzone.com / Admin123");
  } else {
    console.log("[SEED] Admin already exists.");
  }
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

connectDB().then(seedAdmin);
