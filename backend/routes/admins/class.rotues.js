const express = require("express");
const router = express.Router();
const classController = require("../../controllers/admins/class.controller");

router.post("/", classController.createClass);

module.exports = router;