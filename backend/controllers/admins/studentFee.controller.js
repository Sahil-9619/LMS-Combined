const StudentFee = require("../../models/studentFee.model");
const Student = require("../../models/student.model");
const FeeStructure = require("../../models/feeStructure.model");


// ================================
// ASSIGN FEE TO STUDENT
// ================================
exports.assignFeeToStudent = async (req, res) => {
  try {

    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required",
      });
    }

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const feeStructure = await FeeStructure.findOne({
      classId: student.classId,
      status: "active",
    });

    if (!feeStructure) {
      return res.status(404).json({
        success: false,
        message: "Fee structure not found for this class",
      });
    }

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

    const studentFee = await StudentFee.create({

      studentId: student._id,
      feeStructureId: feeStructure._id,

      tuitionFee: feeStructure.tuitionFee,
      admissionFee: feeStructure.admissionFee,
      examFee: feeStructure.examFee,
      hostelFee: feeStructure.hostelFee,
      transportFee: feeStructure.transportFee,

      totalAssignedFee: feeStructure.totalFee,
      remainingAmount: feeStructure.totalFee,
      totalPaid: 0,

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



// ================================
// GET FEES BY ADMISSION NUMBER
// ================================
exports.getFeeByAdmissionNumber = async (req, res) => {

  try {

    const { admissionNumber } = req.params;

    const student = await Student.findOne({ admissionNumber })
      .populate("classId");

    if (!student) {
      return res.status(404).json({
        success:false,
        message:"Student not found"
      });
    }

    const fee = await StudentFee.findOne({ studentId: student._id })
      .populate("studentId")
      .populate("feeStructureId")
      .lean();

    if (!fee) {
      return res.status(404).json({
        success:false,
        message:"Fee not assigned"
      });
    }

    // fallback from FeeStructure
    fee.tuitionFee = fee.tuitionFee ?? fee.feeStructureId?.tuitionFee ?? 0;
    fee.admissionFee = fee.admissionFee ?? fee.feeStructureId?.admissionFee ?? 0;
    fee.examFee = fee.examFee ?? fee.feeStructureId?.examFee ?? 0;
    fee.hostelFee = fee.hostelFee ?? fee.feeStructureId?.hostelFee ?? 0;
    fee.transportFee = fee.transportFee ?? fee.feeStructureId?.transportFee ?? 0;
    fee.lateFeePerDay = fee.lateFeePerDay ?? fee.feeStructureId?.lateFeePerDay ?? 0;

    res.json({
      success:true,
      student,
      fee
    });

  } catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};
// ================================
// UPDATE PAYMENT
// ================================
exports.updateStudentFee = async (req, res) => {

  try {

    const { admissionNumber, payAmount } = req.body;

    const student = await Student.findOne({ admissionNumber });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const studentFee = await StudentFee.findOne({ studentId: student._id });

    const payment = Number(payAmount);

    studentFee.totalPaid += payment;

    studentFee.remainingAmount =
      studentFee.totalAssignedFee - studentFee.totalPaid;

    if (studentFee.remainingAmount <= 0) {

      studentFee.status = "paid";
      studentFee.remainingAmount = 0;

    } else {

      studentFee.status = "partial";

    }

    await studentFee.save();

    res.json({
      success: true,
      message: "Payment updated successfully",
      data: studentFee
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};
exports.getFeesByStudent = async (req, res) => {
  try {

    const { studentId } = req.params;

    const fees = await StudentFee.find({ studentId })
      .populate("studentId")
      .populate("feeStructureId");

    res.status(200).json({
      success: true,
      data: fees
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



// ================================
// ADMIN UPDATE STUDENT FEE
// ================================
exports.updateStudentSpecificFee = async (req, res) => {
  try {

    const { admissionNumber } = req.params;

    const {
      tuitionFee = 0,
      admissionFee = 0,
      examFee = 0,
      hostelFee = 0,
      transportFee = 0,
      lateFeePerDay = 0
    } = req.body;

    const student = await Student.findOne({ admissionNumber });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const studentFee = await StudentFee.findOne({ studentId: student._id });

    if (!studentFee) {
      return res.status(404).json({
        success: false,
        message: "Student fee record not found"
      });
    }

    // update individual fields
    studentFee.tuitionFee = tuitionFee;
    studentFee.admissionFee = admissionFee;
    studentFee.examFee = examFee;
    studentFee.hostelFee = hostelFee;
    studentFee.transportFee = transportFee;
    studentFee.lateFeePerDay = lateFeePerDay;

    // calculate new total
    const newTotal =
      Number(tuitionFee) +
      Number(admissionFee) +
      Number(examFee) +
      Number(hostelFee) +
      Number(transportFee) +
      Number(lateFeePerDay);

    studentFee.totalAssignedFee = newTotal;

    // recalc remaining
    studentFee.remainingAmount = newTotal - studentFee.totalPaid;

    // update status
    if (studentFee.remainingAmount <= 0) {
      studentFee.status = "paid";
      studentFee.remainingAmount = 0;
    } else if (studentFee.totalPaid > 0) {
      studentFee.status = "partial";
    } else {
      studentFee.status = "due";
    }

    await studentFee.save();

    res.json({
      success: true,
      message: "Student fee updated successfully",
      data: studentFee
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};