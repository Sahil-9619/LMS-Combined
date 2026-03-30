const express = require("express");
const router = express.Router();

const {
  getAllInvoices,
  downloadInvoice,
} = require("../../controllers/admins/invoice.controller");

// GET ALL
router.get("/", getAllInvoices);
router.get("/download",  downloadInvoice);

module.exports = router;