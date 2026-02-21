const StudentFee = require("../../models/studentFee.model");
const Student = require("../../models/student.model");
const FeeStructure = require("../../models/feeStructure.model");

exports.assignFeeToStudent = async (req, res) => {
  try {
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required",
      });
    }

    // 1️⃣ Check student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // 2️⃣ Find active FeeStructure for class
    const feeStructure = await FeeStructure.findOne({
      classId: student.classId,
      academicYear: student.academicYear,
      status: "active",
    });

    if (!feeStructure) {
      return res.status(404).json({
        success: false,
        message: "Fee structure not found for this class",
      });
    }

    // 3️⃣ Check duplicate
    const alreadyAssigned = await StudentFee.findOne({
      studentId: student._id,
      feeStructureId: feeStructure._id,
    });

    if (alreadyAssigned) {
      return res.status(400).json({
        success: false,
        message: "Fee already assigned to this student",
      });
    }

    // 4️⃣ Create StudentFee
    const studentFee = await StudentFee.create({
      studentId: student._id,
      feeStructureId: feeStructure._id,
      totalAssignedFee: feeStructure.totalFee,
      remainingAmount: feeStructure.totalFee,
    });

    return res.status(201).json({
      success: true,
      message: "Fee assigned successfully",
      data: studentFee,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};