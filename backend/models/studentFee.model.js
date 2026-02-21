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