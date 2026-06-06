const express = require("express");
const router = express.Router();
const { loginAdmin, registerAdmin, getDashboard } = require("../Controllers/AdminController");

router.post("/register", registerAdmin); // one-time use to seed admin
router.post("/login", loginAdmin);
router.get("/dashboard", getDashboard);

module.exports = router;
