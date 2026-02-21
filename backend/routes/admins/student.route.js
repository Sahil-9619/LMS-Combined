const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admins/student.controller");

router.post("/", controller.createStudent);
router.get("/class/:classId", controller.getStudentsByClass);

module.exports = router;