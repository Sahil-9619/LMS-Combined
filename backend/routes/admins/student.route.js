const express = require("express");
const router = express.Router();
const multer = require("multer");

const controller = require("../../controllers/admins/student.controller");
const upload = multer({
  dest: "uploads/",   // folder ban jayega automatically
});

router.post("/",   upload.single("photo"), controller.createStudent);
router.get("/class/:classId", controller.getStudentsByClass);
router.get("/:id", controller.getStudentById);

module.exports = router;