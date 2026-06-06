const express = require("express");
const router = express.Router();
const { createContact, getAllContacts, deleteContact } = require("../Controllers/ContactController");

router.post("/", createContact);
router.get("/", getAllContacts);
router.delete("/:id", deleteContact);

module.exports = router;
