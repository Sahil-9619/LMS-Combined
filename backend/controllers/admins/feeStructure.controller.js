const FeeStructure = require("../../models/feeStructure.model");
const Class = require("../../models/class.model");

// ================================
// CREATE FEE STRUCTURE
// ================================
exports.createFeeStructure = async (req, res) => {
  try {
    const {
      classId,
      academicYear,
      tuitionFee = 0,
      admissionFee = 0,
      examFee = 0,
      hostelFee = 0,
      transportFee = 0,
      installments = [],
      lateFeePerDay = 0,
    } = req.body;

    if (!classId || !academicYear) {
      return res.status(400).json({
        success: false,
        message: "Class and academic year are required",
      });
    }

    // ✅ Check class exists
    const classExists = await Class.findById(classId);
    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    // ❌ Prevent duplicate for same class + academic year
    const existing = await FeeStructure.findOne({
      classId,
      academicYear,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Fee structure already exists for this class and academic year",
      });
    }

    const fee = await FeeStructure.create({
      classId,
      academicYear,
      tuitionFee,
      admissionFee,
      examFee,
      hostelFee,
      transportFee,
      installments,
      lateFeePerDay,
    });

    res.status(201).json({
      success: true,
      message: "Fee structure created successfully",
      data: fee,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================================
// GET ALL FEE STRUCTURES
// ================================
exports.getAllFeeStructures = async (req, res) => {
  try {
    const { classId, academicYear } = req.query;

    let filter = {};

    if (classId) filter.classId = classId;
    if (academicYear) filter.academicYear = academicYear;

    const fees = await FeeStructure.find(filter)
      .populate("classId")  // 👈 important
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: fees.length,
      data: fees,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================================
// GET SINGLE FEE STRUCTURE
// ================================
exports.getSingleFeeStructure = async (req, res) => {
  try {
    const { id } = req.params;

    const fee = await FeeStructure.findById(id)
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
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================================
// UPDATE FEE STRUCTURE
// ================================
exports.updateFeeStructure = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await FeeStructure.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Fee structure not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fee updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
    res.status(500).json({ success: false, message: error.message });
  }
};