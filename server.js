const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./Utils/db");

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

// Start server first, then connect DB
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

connectDB();
