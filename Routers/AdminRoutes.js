const express = require("express");
const router = express.Router();
const { loginAdmin, getDashboard } = require("../Controllers/AdminController");

router.post("/login", loginAdmin);
router.get("/dashboard", getDashboard);

module.exports = router;
