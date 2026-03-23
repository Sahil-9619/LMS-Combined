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

    // 🔥 DYNAMIC FEES (MAIN CHANGE)
    feeComponents: [
      {
        name: String,     // tuition, exam, library etc.
        amount: Number,
        type: {
          type: String,
          enum: ["monthly", "one-time"],
          default: "one-time"
        }
      }
    ],

    // 💰 Payments
    payments: [
      {
        amount: Number,
        date: { type: Date, default: Date.now }
      }
    ],

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