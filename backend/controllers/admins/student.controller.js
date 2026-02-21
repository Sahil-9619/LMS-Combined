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
    } = req.body;

    // Check required fields
    if (!admissionNumber || !firstName || !classId || !academicYear || !rollNumber) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // Check class exists
    const classExists = await Class.findById(classId);
    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    const student = await Student.create({
      admissionNumber,
      rollNumber,
      firstName,
      lastName,
      gender,
      classId,
      academicYear,
      parentName,
      parentPhone,
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