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


// ================================get fees for a student================
exports.getFeesByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const fees = await StudentFee.find({ studentId })
      .populate("studentId")
      .populate("feeStructureId");

    return res.status(200).json({
      success: true,
      data: fees,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================================get fees for a student by admission number================
exports.getFeeByAdmissionNumber = async (req, res) => {
  try {
    const { admissionNumber } = req.params;

    const student = await Student.findOne({ admissionNumber })
    .populate("classId");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const fee = await StudentFee.findOne({ studentId: student._id })
      .populate("studentId")
      .populate("feeStructureId");

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee not assigned to this student",
      });
    }

    res.status(200).json({
      success: true,
      student,
      fee
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================================ update student fee (handle payment) =================

exports.updateStudentFee = async (req, res) => {
  try {

    const { admissionNumber, payAmount } = req.body;

    if (!admissionNumber || !payAmount) {
      return res.status(400).json({
        success: false,
        message: "Admission number and payment amount required",
      });
    }

    // 1️⃣ Find student
    const student = await Student.findOne({ admissionNumber });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // 2️⃣ Find student fee
    const studentFee = await StudentFee.findOne({ studentId: student._id });

    if (!studentFee) {
      return res.status(404).json({
        success: false,
        message: "Fee record not found",
      });
    }

    const payment = Number(payAmount);

    // 3️⃣ Update payment
    studentFee.totalPaid += payment;

    // 4️⃣ Calculate remaining
    studentFee.remainingAmount =
      studentFee.totalAssignedFee - studentFee.totalPaid;

    // 5️⃣ Update status
    if (studentFee.remainingAmount <= 0) {

      studentFee.status = "paid";
      studentFee.remainingAmount = 0;

    } else if (studentFee.totalPaid > 0) {

      studentFee.status = "partial";

    } else {

      studentFee.status = "due";

    }

    await studentFee.save();

    return res.status(200).json({
      success: true,
      message: "Payment updated successfully",
      data: studentFee,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
