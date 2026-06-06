const Contact = require("../Models/ContactModel");
const { isValidEmail } = require("../Utils/validation");

// POST /api/contact
const createContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message)
      return res.status(400).json({ message: "Name, email, subject, and message are required" });

    if (!isValidEmail(email))
      return res.status(400).json({ message: "Invalid email format" });

    const contact = await Contact.create({ name, email, phone, subject, message });
    res.status(201).json({ message: "Message sent successfully", contact });
  } catch (error) {
    res.status(500).json({ message: "Failed to send message", error: error.message });
  }
};

// GET /api/contact
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ total: contacts.length, contacts });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages", error: error.message });
  }
};

// DELETE /api/contact/:id
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact)
      return res.status(404).json({ message: "Message not found" });
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete message", error: error.message });
  }
};

module.exports = { createContact, getAllContacts, deleteContact };
