const mongoose = require("mongoose");

const studentFeeSchema = new mongoose.Schema(
{
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },

  feeStructureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FeeStructure",
    required: true,
  },

  tuitionFee: {
    type: Number,
    default: 0
  },

  admissionFee: {
    type: Number,
    default: 0
  },

  examFee: {
    type: Number,
    default: 0
  },

  hostelFee: {
    type: Number,
    default: 0
  },

  transportFee: {
    type: Number,
    default: 0
  },

  lateFeePerDay: { type: Number, default: 0 },

  totalAssignedFee: {
    type: Number,
    required: true,
  },

  totalPaid: {
    type: Number,
    default: 0,
  },

  remainingAmount: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    enum: ["paid", "partial", "due"],
    default: "due",
  },

},
{ timestamps: true }
);

studentFeeSchema.index({ studentId: 1 });

module.exports = mongoose.model("StudentFee", studentFeeSchema);