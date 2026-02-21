const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admins/studentFee.controller");

router.post("/assign", controller.assignFeeToStudent);

module.exports = router;