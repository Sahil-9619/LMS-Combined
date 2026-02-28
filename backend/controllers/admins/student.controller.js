const mongoose = require("mongoose");
const Student = require("../../models/student.model");
const Class = require("../../models/class.model");

// =====================================
// AUTO GENERATE ADMISSION NUMBER
// =====================================
const generateAdmissionNumber = async () => {
  const lastStudent = await Student.findOne()
    .sort({ createdAt: -1 })
    .select("admissionNumber");

  if (!lastStudent) {
    return "ADM1001";
  }

  const lastNumber = parseInt(
    lastStudent.admissionNumber.replace("ADM", "")
  );

  return `ADM${lastNumber + 1}`;
};

// =====================================
// CREATE STUDENT (AUTO CLASS FETCH)
// =====================================
exports.createStudent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      gender,
      course, // 👈 frontend se aayega (e.g. "10")
      parentName,
      parentPhone,
      phone,
      email,
    } = req.body;

    // ========================
    // Required Fields Check
    // ========================
    if (!firstName || !course) {
      return res.status(400).json({
        success: false,
        message: "First Name and Class are required",
      });
    }

    // ========================
    // AUTO FETCH CLASS
    // ========================
    const classData = await Class.findOne({
      className: course,
      status: "active",
    });

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Selected class not found",
      });
    }

    // ========================
    // Generate Admission Number
    // ========================
    const admissionNumber = await generateAdmissionNumber();

    // ========================
    // Create Student
    // ========================
    const student = await Student.create({
      admissionNumber,
      firstName: firstName.trim(),
      lastName: lastName?.trim(),
      gender,
      classId: classData._id, // 👈 automatically set
      parentName,
      parentPhone,
      phone,
      email,
      profileImage: req.file?.filename,
    });

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });

  } catch (error) {
    console.error("Create Student Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// GET STUDENTS BY CLASS
// =====================================
exports.getStudentsByClass = async (req, res) => {
  try {
    const { classId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Class ID",
      });
    }

    const students = await Student.find({ classId })
      .populate("classId")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });

  } catch (error) {
    console.error("Get Students Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id)
      .populate("classId");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });

  } catch (error) {
    console.error("Get Student Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};