const express = require("express");
const router = express.Router();
const { createAdoption, getAllAdoptions, approveAdoption, rejectAdoption } = require("../Controllers/AdoptionController");

router.post("/", createAdoption);
router.get("/", getAllAdoptions);
router.put("/:id/approve", approveAdoption);
router.put("/:id/reject", rejectAdoption);

module.exports = router;
