const express = require("express");
const router = express.Router();
const { registerSeller, loginSeller, getAllSellers, getSellerById } = require("../Controllers/SellerController");

router.post("/register", registerSeller);
router.post("/login", loginSeller);
router.get("/", getAllSellers);
router.get("/:id", getSellerById);

module.exports = router;
