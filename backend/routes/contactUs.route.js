const express = require("express");
const router = express.Router();

const {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
} = require("../controllers/contactUs.controller");

// Public
router.post("/create", createContact);

// Admin
router.get("/all", getAllContacts);
router.get("/:id", getContactById);
router.put("/update-status/:id", updateContactStatus);

module.exports = router;