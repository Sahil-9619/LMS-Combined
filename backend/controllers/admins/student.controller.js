const mongoose = require("mongoose");
const Student = require("../../models/student.model");
const Class = require("../../models/class.model");

// ================================
// CREATE STUDENT
// ================================
exports.createStudent = async (req, res) => {
  try {
    const {
      admissionNumber,
      rollNumber,
      firstName,
      lastName,
      gender,
      classId,
      academicYear,
      parentName,
      parentPhone,
      phone,
      email,
    } = req.body;

    // ========================
    // Required Fields Check
    // ========================
    if (
      !admissionNumber ||
      !firstName ||
      !lastName ||
      !academicYear ||
      !rollNumber ||
      !classId
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // ========================
    // Validate ObjectId
    // ========================
    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Class ID",
      });
    }

    // ========================
    // Check Class Exists
    // ========================
    const classExists = await Class.findById(classId);

    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    // ========================
    // Create Student
    // ========================
    const student = await Student.create({
      admissionNumber: admissionNumber.trim(),
      rollNumber: Number(rollNumber),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      gender,
      classId,                 // ✅ IMPORTANT
      academicYear: academicYear.trim(),
      parentName,
      parentPhone,
      phone,
      email,
    });

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================================
// GET STUDENTS BY CLASS
// ================================
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
      .populate("classId");

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};