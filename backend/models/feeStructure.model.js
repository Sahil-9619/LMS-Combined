const mongoose = require("mongoose");

const installmentSchema = new mongoose.Schema({
  installmentName: String,
  amount: Number,
  dueDate: Date,
});

const feeStructureSchema = new mongoose.Schema(
  {
    // 🔗 Link with Class
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    academicYear: {
      type: String,
      required: true,
    },

    tuitionFee: { type: Number, default: 0 },
    admissionFee: { type: Number, default: 0 },
    examFee: { type: Number, default: 0 },
    hostelFee: { type: Number, default: 0 },
    transportFee: { type: Number, default: 0 },

    totalFee: { type: Number },

    installments: [installmentSchema],

    lateFeePerDay: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Auto calculate total
feeStructureSchema.pre("save", function (next) {
  this.totalFee =
    this.tuitionFee +
    this.admissionFee +
    this.examFee +
    this.hostelFee +
    this.transportFee;

  next();
});

// Prevent duplicate per class + year
feeStructureSchema.index(
  { classId: 1, academicYear: 1 },
  { unique: true }
);

module.exports = mongoose.model("FeeStructure", feeStructureSchema);