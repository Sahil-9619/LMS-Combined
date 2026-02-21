const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
    },

    section: {
      type: String, // A, B, C
      required: true,
    },

    academicYear: {
      type: String, // 2025-2026
      required: true,
    },

    classTeacher: {
      type: String,
    },

    strength: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Prevent duplicate class in same year
classSchema.index(
  { className: 1, section: 1, academicYear: 1 },
  { unique: true }
);

module.exports = mongoose.model("Class", classSchema);