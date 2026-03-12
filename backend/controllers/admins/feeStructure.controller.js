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

    const classExists = await Class.findById(classId);

    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    const existing = await FeeStructure.findOne({ classId });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Fee structure already exists for this class",
      });
    }

    const totalFee =
      Number(tuitionFee ?? 0) +
      Number(admissionFee ?? 0) +
      Number(examFee ?? 0) +
      Number(hostelFee ?? 0) +
      Number(transportFee ?? 0);

    const fee = await FeeStructure.create({
      classId,
      tuitionFee,
      admissionFee,
      examFee,
      hostelFee,
      transportFee,
      installments,
      lateFeePerDay,
      totalFee
    });

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

    const { classId } = req.query;

    let filter = {};

    if (classId) filter.classId = classId;

    const fees = await FeeStructure.find(filter)
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

    const fee = await FeeStructure.findOne({ classId: id })
      .populate("classId");

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
      Number(tuitionFee ?? 0) +
      Number(admissionFee ?? 0) +
      Number(examFee ?? 0) +
      Number(hostelFee ?? 0) +
      Number(transportFee ?? 0);

    const updated = await FeeStructure.findOneAndUpdate(
      { classId: id },
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

    // 🔥 Sync all student fees of this class
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