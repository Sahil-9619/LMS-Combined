const FeeStructure = require("../../models/feeStructure.model");
const Class = require("../../models/class.model");
const StudentFee = require("../../models/studentFee.model");


// ================================
// CREATE FEE STRUCTURE
// ================================
exports.createFeeStructure = async (req, res) => {
  try {

    const {
      classId,
      tuitionFee = 0,
      admissionFee = 0,
      examFee = 0,
      hostelFee = 0,
      transportFee = 0,
      installments = [],
      lateFeePerDay = 0,
    } = req.body;

    if (!classId) {
      return res.status(400).json({
        success: false,
        message: "Class is required",
      });
    }

    const classData = await Class.findById(classId);

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    const existing = await FeeStructure.findOne({
      className: classData.className
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Fee structure already exists for this class",
      });
    }

    const totalFee =
      Number(tuitionFee) +
      Number(admissionFee) +
      Number(examFee) +
      Number(hostelFee) +
      Number(transportFee);

    const fee = await FeeStructure.create({
      classId,
      className: classData.className,
      tuitionFee,
      admissionFee,
      examFee,
      hostelFee,
      transportFee,
      installments,
      lateFeePerDay,
      totalFee
    });
    // ================================
// AUTO ASSIGN FEE TO ALL STUDENTS
// ================================
const students = await require("../../models/student.model").find({
  classId
});

for (const student of students) {

  const exists = await StudentFee.findOne({
    studentId: student._id
  });

  if (!exists) {

    await StudentFee.create({

      studentId: student._id,
      feeStructureId: fee._id,

      tuitionFee: fee.tuitionFee,
      admissionFee: fee.admissionFee,
      examFee: fee.examFee,
      hostelFee: fee.hostelFee,
      transportFee: fee.transportFee,

      totalAssignedFee: fee.totalFee,
      remainingAmount: fee.totalFee,
      totalPaid: 0,
      status: "due"

    });

  }

}

    res.status(201).json({
      success: true,
      message: "Fee structure created successfully",
      data: fee,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


// ================================
// GET ALL FEE STRUCTURES
// ================================
exports.getAllFeeStructures = async (req, res) => {
  try {

    const fees = await FeeStructure.find()
      .populate("classId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: fees.length,
      data: fees,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


// ================================
// GET SINGLE FEE STRUCTURE
// ================================
exports.getSingleFeeStructure = async (req, res) => {
  try {

    const { id } = req.params;

    const classData = await Class.findById(id);

    if (!classData) {
      return res.status(404).json({
        success:false,
        message:"Class not found"
      });
    }

    const fee = await FeeStructure.findOne({
      className: classData.className
    }).populate("classId");

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee structure not found",
      });
    }

    res.status(200).json({
      success: true,
      data: fee,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


// ================================
// UPDATE FEE STRUCTURE
// ================================
exports.updateFeeStructure = async (req, res) => {
  try {

    const { id } = req.params;

    const classData = await Class.findById(id);

    if (!classData) {
      return res.status(404).json({
        success:false,
        message:"Class not found"
      });
    }

    const {
      tuitionFee = 0,
      admissionFee = 0,
      examFee = 0,
      hostelFee = 0,
      transportFee = 0,
      installments = [],
      lateFeePerDay = 0
    } = req.body;

    const totalFee =
      Number(tuitionFee) +
      Number(admissionFee) +
      Number(examFee) +
      Number(hostelFee) +
      Number(transportFee);

    const updated = await FeeStructure.findOneAndUpdate(
      { className: classData.className },
      {
        tuitionFee,
        admissionFee,
        examFee,
        hostelFee,
        transportFee,
        installments,
        lateFeePerDay,
        totalFee
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Fee structure not found",
      });
    }

    // sync student fees
    await StudentFee.updateMany(
      { feeStructureId: updated._id },
      [
        {
          $set: {
            totalAssignedFee: totalFee,
            remainingAmount: {
              $subtract: [totalFee, "$totalPaid"]
            }
          }
        }
      ]
    );

    res.status(200).json({
      success: true,
      message: "Fee updated successfully",
      data: updated,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


// ================================
// DELETE FEE STRUCTURE
// ================================
exports.deleteFeeStructure = async (req, res) => {
  try {

    const { id } = req.params;

    const deleted = await FeeStructure.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Fee structure not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fee deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};