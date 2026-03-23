const FeeStructure = require("../../models/feeStructure.model");
const Class = require("../../models/class.model");
const StudentFee = require("../../models/studentFee.model");
const Student = require("../../models/student.model");
const mongoose = require("mongoose");

// ================================
// CREATE FEE STRUCTURE
// ================================
exports.createFeeStructure = async (req, res) => {
  try {
    const {
      classId,
      feeComponents = [],   // 🔥 NEW
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
      className: classData.className,
      status: "active"
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Active fee structure already exists",
      });
    }

    // 🔥 CALCULATE TOTAL
    const totalFee = feeComponents.reduce(
      (sum, fee) => sum + Number(fee.amount || 0),
      0
    );

    const fee = await FeeStructure.create({
      classId,
      className: classData.className,
      feeComponents,
      installments,
      lateFeePerDay,
      totalFee,
    });

    // ================================
    // AUTO ASSIGN FEE TO STUDENTS
    // ================================
    const students = await Student.find({ classId });

    for (const student of students) {
      const exists = await StudentFee.findOne({
        studentId: student._id
      });

      if (!exists) {
        await StudentFee.create({
          studentId: student._id,
          feeStructureId: fee._id,

          // 🔥 store dynamic fees
          feeComponents: fee.feeComponents,

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
// GET ALL
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
// GET SINGLE
// ================================
exports.getFeeByClassId = async (req, res) => {
  try {
    const { classId } = req.params;

    // 🔥 convert string → ObjectId
    const fee = await FeeStructure.findOne({
      classId: new mongoose.Types.ObjectId(classId),
      status: "active"
    });

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
// UPDATE
// ================================
exports.updateFeeStructure = async (req, res) => {
  try {
    const { classId, feeComponents = [], installments = [], lateFeePerDay = 0 } = req.body;

    const totalFee = feeComponents.reduce(
      (sum, fee) => sum + Number(fee.amount || 0),
      0
    );

    const updated = await FeeStructure.findOneAndUpdate(
      { classId, status: "active" },
      {
        feeComponents,
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

    await StudentFee.updateMany(
      { feeStructureId: updated._id },
      [
        {
          $set: {
            feeComponents: updated.feeComponents,
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
// DELETE
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